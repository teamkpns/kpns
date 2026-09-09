'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Table,
  Tag,
  Button,
  Card,
  Spin,
  Alert,
  Modal,
  Input,
  Select,
  Tabs,
  Badge,
  Tooltip,
  Divider,
} from 'antd';
import {
  WalletOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PrinterOutlined,
  SearchOutlined,
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
  DownloadOutlined,
  ArrowLeftOutlined,
  CreditCardOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { MemberLayout } from '@/components/layouts/MemberLayout';
import { usePortal } from '@/context/portal-context';
import { transactionsSupabase } from '@/lib/supabase/transactions-client';
import { KPNS_COLORS } from '@/lib/constants';

interface TransactionRecord {
  id: number;
  receipt_no: string;
  member_id: number;
  event_id: number | null;
  due_id: number | null;
  type: string;
  amount: number;
  payment_mode: string;
  notes: string | null;
  created_at: string;
}

interface EventRecord {
  id: number;
  title: string;
  description: string | null;
  contribution_amount: number;
  event_date: string;
}

interface BackendMemberRecord {
  id: number;
  form_no: string | null;
  member_code: string;
  name: string;
  father_name: string | null;
  date_of_admission: string | null;
  phone: string | null;
  blood_group: string | null;
}

export default function MemberTransactionsPage() {
  const { currentUser, clubSettings } = usePortal();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [backendMember, setBackendMember] = useState<BackendMemberRecord | null>(null);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);
  
  // Filtering & search
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('history');

  // Receipt Modal
  const [selectedReceipt, setSelectedReceipt] = useState<TransactionRecord | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  useEffect(() => {
    async function fetchTransactionData() {
      if (!currentUser?.memberId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMsg(null);

      try {
        const memCode = currentUser.memberId.trim();

        // 1. Find member in kpns1935 backend
        const { data: memberMatches, error: memberErr } = await transactionsSupabase
          .from('members')
          .select('*')
          .ilike('member_code', memCode);

        if (memberErr) {
          throw new Error('Could not connect to transactions ledger: ' + memberErr.message);
        }

        let matchedMember = memberMatches && memberMatches.length > 0 ? memberMatches[0] : null;

        // Fallback by name if code did not match directly
        if (!matchedMember && currentUser.name) {
          const cleanName = currentUser.name.trim();
          const { data: nameMatches } = await transactionsSupabase
            .from('members')
            .select('*')
            .ilike('name', '%' + cleanName + '%')
            .limit(1);
          if (nameMatches && nameMatches.length > 0) {
            matchedMember = nameMatches[0];
          }
        }

        // 2. Fetch all events for dues & event title mapping
        const { data: eventsData, error: eventsErr } = await transactionsSupabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: false });

        if (eventsErr) {
          console.warn('Could not load events:', eventsErr);
        } else {
          setEvents(eventsData || []);
        }

        if (matchedMember) {
          setBackendMember(matchedMember);

          // 3. Fetch all transactions for this member
          const { data: txData, error: txErr } = await transactionsSupabase
            .from('transactions')
            .select('*')
            .eq('member_id', matchedMember.id)
            .order('created_at', { ascending: false });

          if (txErr) {
            throw new Error('Failed to fetch transaction logs: ' + txErr.message);
          }

          setTransactions(txData || []);
        } else {
          setBackendMember(null);
          setTransactions([]);
        }
      } catch (err: any) {
        console.error('Error in fetchTransactionData:', err);
        setErrorMsg(err.message || 'Error loading transaction records.');
      } finally {
        setLoading(false);
      }
    }

    fetchTransactionData();
  }, [currentUser]);

  // Event title lookup map
  const eventsMap = useMemo(() => {
    const map = new Map<number, EventRecord>();
    events.forEach((e) => map.set(e.id, e));
    return map;
  }, [events]);

  // Financial Calculations (Paid, Due, Advance)
  const financialSummary = useMemo(() => {
    const totalPaid = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const admissionDate = backendMember?.date_of_admission
      ? dayjs(backendMember.date_of_admission)
      : null;

    let totalDue = 0;
    let totalAdvance = 0;

    // Evaluate each event with a mandatory fee
    const eventBreakdown = events
      .filter((ev) => ev.contribution_amount > 0)
      .map((ev) => {
        const evDate = dayjs(ev.event_date);
        const paidForEvent = transactions
          .filter((t) => t.event_id === ev.id)
          .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

        const reqAmount = Number(ev.contribution_amount) || 0;

        // Skip  New Member Registration Fee if member admitted before event year
        const isRegFee = ev.title.toLowerCase().includes('registration fee');
        const evYear = evDate.year();
        let isApplicable = true;

        if (isRegFee) {
          // If admitted before that year and did not pay for it, it is not applicable
          if (admissionDate && admissionDate.year() !== evYear && paidForEvent === 0) {
            isApplicable = false;
          }
        }

        // Only events occurring on or after member admission year are charged
        if (admissionDate && evYear < admissionDate.year() && paidForEvent === 0) {
          isApplicable = false;
        }

        const balance = paidForEvent - (isApplicable ? reqAmount : 0);
        let status: 'PAID' | 'DUE' | 'ADVANCE' | 'NOT_APPLICABLE' = 'PAID';

        if (!isApplicable) {
          status = 'NOT_APPLICABLE';
        } else if (balance === 0) {
          status = 'PAID';
        } else if (balance > 0) {
          status = 'ADVANCE';
          totalAdvance += balance;
        } else {
          status = 'DUE';
          totalDue += Math.abs(balance);
        }

        return {
          eventId: ev.id,
          title: ev.title,
          date: ev.event_date,
          required: reqAmount,
          paid: paidForEvent,
          balance,
          status,
        };
      });

    // Also include donations/general development fund in advance/surplus
    const donationTotal = transactions
      .filter((t) => t.type === 'member_donation')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    return {
      totalPaid,
      totalDue,
      totalAdvance: totalAdvance + donationTotal,
      donationTotal,
      eventBreakdown,
    };
  }, [transactions, events, backendMember]);

  // Filtered transactions for table
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const ev = tx.event_id ? eventsMap.get(tx.event_id) : null;
      const evTitle = ev ? ev.title.toLowerCase() : '';
      const receiptNo = (tx.receipt_no || '').toLowerCase();
      const notes = (tx.notes || '').toLowerCase();
      const matchSearch =
        searchTerm === '' ||
        receiptNo.includes(searchTerm.toLowerCase()) ||
        evTitle.includes(searchTerm.toLowerCase()) ||
        notes.includes(searchTerm.toLowerCase());

      const matchType =
        typeFilter === 'ALL' ||
        (typeFilter === 'PAYMENT' && tx.type === 'member_payment') ||
        (typeFilter === 'DONATION' && tx.type === 'member_donation');

      return matchSearch && matchType;
    });
  }, [transactions, searchTerm, typeFilter, eventsMap]);

  // Print Receipt handler
  const handlePrintReceipt = (tx: TransactionRecord) => {
    setSelectedReceipt(tx);
    setIsReceiptModalOpen(true);
  };

  const executePrint = () => {
    window.print();
  };

  return (
    <MemberLayout>
      <div className="space-y-6">
        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/member/dashboard"
                className="text-xs font-semibold text-gray-500 hover:text-[#3447AA] flex items-center gap-1"
              >
                <ArrowLeftOutlined /> Back to Dashboard
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              My Transactions &amp; Dues
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Personal contribution ledger, dues statement, and verified receipts for{' '}
              <strong className="text-gray-800">{currentUser?.name}</strong> ({currentUser?.memberId}).
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-[#3447AA] text-xs font-bold border border-blue-100">
              <CreditCardOutlined /> KPNS Ledger Sync
            </span>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <Spin size="large" />
            <p className="mt-4 text-xs font-semibold text-gray-500">
              Connecting to secure accounts ledger database...
            </p>
          </div>
        )}

        {/* Error state */}
        {!loading && errorMsg && (
          <Alert
            type="error"
            showIcon
            message="Database Notice"
            description={errorMsg}
            className="rounded-2xl"
          />
        )}

        {/* Member not found on transactions database */}
        {!loading && !errorMsg && !backendMember && (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#3447AA] text-2xl flex items-center justify-center mx-auto">
              <WalletOutlined />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No Transaction Ledger Found</h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
              We could not find an existing accounts ledger for member code{' '}
              <strong className="text-gray-900">{currentUser?.memberId}</strong>. If you recently
              joined or registered, your offline ledger entries will be updated shortly by the club
              accounts team.
            </p>
            <div className="pt-2">
              <Link href="/member/dashboard">
                <Button className="rounded-xl font-bold text-xs h-9 px-4">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Main Data View */}
        {!loading && backendMember && (
          <>
            {/* 3 Summary Metric Cards: Total Paid, Due, Advance */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Total Paid */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                    TOTAL CONTRIBUTED / PAID
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-green-600 mt-1">
                    ₹{financialSummary.totalPaid.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Across {transactions.length} verified receipts
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center text-xl">
                  <CheckCircleOutlined />
                </div>
              </div>

              {/* Total Due */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                    PENDING DUES
                  </p>
                  <p
                    className={`text-2xl sm:text-3xl font-black mt-1 ${
                      financialSummary.totalDue > 0 ? 'text-red-600' : 'text-gray-800'
                    }`}
                  >
                    ₹{financialSummary.totalDue.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {financialSummary.totalDue > 0 ? 'Pending subscription/fees' : 'All clear! No pending dues'}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                    financialSummary.totalDue > 0
                      ? 'bg-red-50 text-red-600'
                      : 'bg-gray-50 text-gray-400'
                  }`}
                >
                  <ExclamationCircleOutlined />
                </div>
              </div>

              {/* Advance / Surplus */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                    ADVANCE &amp; DONATIONS
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-[#3447AA] mt-1">
                    ₹{financialSummary.totalAdvance.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Surplus advance &amp; special donations
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#FBEAEB] text-[#3447AA] flex items-center justify-center text-xl">
                  <TrophyOutlined />
                </div>
              </div>
            </div>

            {/* Tabs for Transaction History vs Event Dues Statement */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6">
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                size="large"
                items={[
                  {
                    key: 'history',
                    label: (
                      <span className="font-bold flex items-center gap-2 text-xs sm:text-sm">
                        <FileTextOutlined /> Transaction Receipts ({transactions.length})
                      </span>
                    ),
                  },
                  {
                    key: 'dues',
                    label: (
                      <span className="font-bold flex items-center gap-2 text-xs sm:text-sm">
                        <ClockCircleOutlined /> Annual Dues &amp; Fees Statement
                      </span>
                    ),
                  },
                ]}
              />

              {/* Tab 1: Transaction History */}
              {activeTab === 'history' && (
                <div className="space-y-4 pt-2">
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <Input
                      placeholder="Search by receipt number, event..."
                      prefix={<SearchOutlined className="text-gray-400" />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      allowClear
                      className="max-w-xs rounded-xl text-xs h-10"
                    />

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Select
                        value={typeFilter}
                        onChange={setTypeFilter}
                        className="w-full sm:w-44 text-xs h-10"
                        options={[
                          { label: 'All Transactions', value: 'ALL' },
                          { label: 'Fee Payments', value: 'PAYMENT' },
                          { label: 'Donations', value: 'DONATION' },
                        ]}
                      />
                    </div>
                  </div>

                  {/* Transactions Table */}
                  <div className="overflow-x-auto">
                    <Table
                      dataSource={filteredTransactions}
                      rowKey="id"
                      pagination={{ pageSize: 8, showSizeChanger: false }}
                      className="rounded-2xl"
                      columns={[
                        {
                          title: 'Receipt No.',
                          dataIndex: 'receipt_no',
                          key: 'receipt_no',
                          render: (val, record) => (
                            <span className="font-mono font-bold text-xs text-[#3447AA]">
                              {val || ('TX-' + record.id)}
                            </span>
                          ),
                        },
                        {
                          title: 'Date',
                          dataIndex: 'created_at',
                          key: 'created_at',
                          render: (val) => (
                            <span className="text-xs text-gray-600">
                              {dayjs(val).format('DD MMM YYYY')}
                            </span>
                          ),
                        },
                        {
                          title: 'Event / Purpose',
                          key: 'event',
                          render: (_, record) => {
                            const ev = record.event_id ? eventsMap.get(record.event_id) : null;
                            return (
                              <div>
                                <p className="text-xs font-bold text-gray-800 leading-tight">
                                  {ev ? ev.title : record.notes || 'General Club Fund'}
                                </p>
                                <span className="text-[10px] text-gray-400 capitalize">
                                  {record.payment_mode || 'Online / Cash'}
                                </span>
                              </div>
                            );
                          },
                        },
                        {
                          title: 'Type',
                          dataIndex: 'type',
                          key: 'type',
                          render: (val) => {
                            const isDonation = val === 'member_donation';
                            return (
                              <Tag
                                color={isDonation ? 'gold' : 'blue'}
                                className="font-bold text-[10px] rounded-md uppercase"
                              >
                                {isDonation ? 'Donation' : 'Payment'}
                              </Tag>
                            );
                          },
                        },
                        {
                          title: 'Amount',
                          dataIndex: 'amount',
                          key: 'amount',
                          align: 'right',
                          render: (val) => (
                            <span className="font-black text-xs text-gray-900">
                              ₹{Number(val).toLocaleString('en-IN')}
                            </span>
                          ),
                        },
                        {
                          title: 'Receipt',
                          key: 'action',
                          align: 'center',
                          render: (_, record) => (
                            <Button
                              size="small"
                              icon={<PrinterOutlined />}
                              onClick={() => handlePrintReceipt(record)}
                              className="rounded-lg text-xs font-bold border-gray-200 text-gray-700 hover:text-[#3447AA]"
                            >
                              Receipt
                            </Button>
                          ),
                        },
                      ]}
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Dues & Subscription Statement */}
              {activeTab === 'dues' && (
                <div className="space-y-4 pt-2">
                  <p className="text-xs text-gray-500">
                    Below is your status for all mandatory annual club subscription fees and
                    festival event contributions:
                  </p>

                  <div className="overflow-x-auto">
                    <Table
                      dataSource={financialSummary.eventBreakdown}
                      rowKey="eventId"
                      pagination={false}
                      className="rounded-2xl"
                      columns={[
                        {
                          title: 'Event / Subscription',
                          dataIndex: 'title',
                          key: 'title',
                          render: (val, record) => (
                            <div>
                              <p className="text-xs font-bold text-gray-800">{val}</p>
                              <span className="text-[10px] text-gray-400">
                                {dayjs(record.date).format('DD MMM YYYY')}
                              </span>
                            </div>
                          ),
                        },
                        {
                          title: 'Required',
                          dataIndex: 'required',
                          key: 'required',
                          align: 'right',
                          render: (val) => (
                            <span className="text-xs font-semibold text-gray-700">
                              ₹{val.toLocaleString('en-IN')}
                            </span>
                          ),
                        },
                        {
                          title: 'Paid',
                          dataIndex: 'paid',
                          key: 'paid',
                          align: 'right',
                          render: (val) => (
                            <span className="text-xs font-bold text-green-700">
                              ₹{val.toLocaleString('en-IN')}
                            </span>
                          ),
                        },
                        {
                          title: 'Status',
                          dataIndex: 'status',
                          key: 'status',
                          align: 'center',
                          render: (status, record) => {
                            if (status === 'NOT_APPLICABLE') {
                              return <Tag className="text-[10px] rounded-md">Not Applicable</Tag>;
                            }
                            if (status === 'PAID') {
                              return (
                                <Tag color="success" className="font-bold text-[10px] rounded-md">
                                  ✓ Cleared
                                </Tag>
                              );
                            }
                            if (status === 'ADVANCE') {
                              return (
                                <Tag color="blue" className="font-bold text-[10px] rounded-md">
                                  +₹{record.balance} Advance
                                </Tag>
                              );
                            }
                            return (
                              <Tag color="error" className="font-bold text-[10px] rounded-md">
                                Due: ₹{Math.abs(record.balance)}
                              </Tag>
                            );
                          },
                        },
                      ]}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Printable Receipt Modal */}
        <Modal
          title={null}
          open={isReceiptModalOpen}
          onCancel={() => setIsReceiptModalOpen(false)}
          footer={[
            <Button key="close" onClick={() => setIsReceiptModalOpen(false)} className="rounded-xl">
              Close
            </Button>,
            <Button
              key="print"
              type="primary"
              icon={<PrinterOutlined />}
              onClick={executePrint}
              className="bg-[#3447AA] rounded-xl font-bold"
            >
              Print Receipt
            </Button>,
          ]}
          width={520}
          className="rounded-3xl overflow-hidden"
        >
          {selectedReceipt && (
            <div id="receipt-print-area" className="p-4 sm:p-6 text-gray-800 space-y-4">
              {/* Header */}
              <div className="text-center border-b border-gray-200 pb-4">
                <p className="text-[11px] font-extrabold text-[#3447AA] uppercase tracking-wider">
                  OFFICIAL MONEY RECEIPT
                </p>
                <h3 className="text-lg font-black text-gray-900 mt-0.5">
                  {clubSettings.clubNameBengali}
                </h3>
                <p className="text-[11px] font-semibold text-gray-500">
                  KHEJURDA PALLIUNNYAYAN NARAYAN SANGHA (KPNS)
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Vill: Khejurda, P.O: Egra, Dist: Purba Medinipur, WB &bull; Reg No: SO168946
                </p>
              </div>

              {/* Receipt Meta */}
              <div className="flex items-center justify-between text-xs bg-gray-50 p-3 rounded-xl">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">RECEIPT NO.</p>
                  <p className="font-mono font-bold text-[#3447AA] text-sm">
                    {selectedReceipt.receipt_no || ('KPNS-MR-' + selectedReceipt.id)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">DATE</p>
                  <p className="font-semibold text-gray-800">
                    {dayjs(selectedReceipt.created_at).format('DD MMM YYYY')}
                  </p>
                </div>
              </div>

              {/* Member Details */}
              <div className="space-y-2 text-xs border border-gray-100 p-3.5 rounded-xl">
                <div className="flex justify-between">
                  <span className="text-gray-500">Member Name:</span>
                  <span className="font-bold text-gray-900">{backendMember?.name || currentUser?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Member ID:</span>
                  <span className="font-mono font-bold text-gray-900">{backendMember?.member_code || currentUser?.memberId}</span>
                </div>
                {backendMember?.form_no && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Form No:</span>
                    <span className="font-semibold text-gray-800">{backendMember.form_no}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Purpose:</span>
                  <span className="font-bold text-[#3447AA]">
                    {selectedReceipt.event_id
                      ? eventsMap.get(selectedReceipt.event_id)?.title
                      : selectedReceipt.notes || 'Club Contribution'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Mode:</span>
                  <span className="font-semibold text-gray-800">{selectedReceipt.payment_mode || 'UPI / Online'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Category:</span>
                  <span className="capitalize font-semibold text-gray-800">
                    {selectedReceipt.type === 'member_donation' ? 'Voluntary Donation' : 'Membership Fee / Subscription'}
                  </span>
                </div>
              </div>

              {/* Amount Box */}
              <div className="bg-[#FBEAEB] p-4 rounded-2xl flex items-center justify-between border border-pink-200/80">
                <span className="text-xs font-bold text-gray-700 uppercase">Amount Received</span>
                <span className="text-2xl font-black text-[#3447AA]">
                  ₹{Number(selectedReceipt.amount).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Footer Note */}
              <div className="pt-2 text-[10px] text-gray-400 text-center">
                This is a computer generated receipt from KPNS Financial Accounts Ledger.
              </div>
            </div>
          )}
        </Modal>
      </div>
    </MemberLayout>
  );
}
