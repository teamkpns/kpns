'use client';

import React, { useState } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Switch,
  Popconfirm,
  Tag,
  Empty,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileImageOutlined,
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  CalendarOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { usePortal } from '@/context/portal-context';
import { ActivityPost } from '@/types';

const { TextArea } = Input;

export default function AdminPostsPage() {
  const {
    activityPosts,
    createActivityPost,
    updateActivityPost,
    deleteActivityPost,
    refreshData,
    currentUser,
  } = usePortal();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<ActivityPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [form] = Form.useForm();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const openCreateModal = () => {
    setEditingPost(null);
    form.resetFields();
    form.setFieldsValue({ published: true, postDate: dayjs() });
    setModalOpen(true);
  };

  const openEditModal = (post: ActivityPost) => {
    setEditingPost(post);
    form.setFieldsValue({
      title: post.title,
      postDate: dayjs(post.postDate),
      photoUrl: post.photoUrl || '',
      body: post.body,
      fbLink: post.fbLink || '',
      instagramLink: post.instagramLink || '',
      youtubeLink: post.youtubeLink || '',
      xLink: post.xLink || '',
      published: post.published,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const postData = {
        title: values.title.trim(),
        body: values.body.trim(),
        photoUrl: values.photoUrl?.trim() || undefined,
        postDate: values.postDate.format('YYYY-MM-DD'),
        fbLink: values.fbLink?.trim() || undefined,
        instagramLink: values.instagramLink?.trim() || undefined,
        youtubeLink: values.youtubeLink?.trim() || undefined,
        xLink: values.xLink?.trim() || undefined,
        published: values.published ?? true,
        createdBy: currentUser?.name || 'Admin',
      };

      if (editingPost) {
        await updateActivityPost(editingPost.id, postData);
      } else {
        await createActivityPost(postData);
      }

      setModalOpen(false);
    } catch {
      // validation error
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (post: ActivityPost) => {
    await updateActivityPost(post.id, { published: !post.published });
  };

  const publishedCount = activityPosts.filter((p) => p.published).length;
  const draftCount = activityPosts.filter((p) => !p.published).length;

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <FileImageOutlined className="text-[#3447AA]" />
            Activity Posts
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage news, events, and program updates shown on the About page and Home page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            icon={<ReloadOutlined spin={refreshing} />}
            onClick={handleRefresh}
            className="rounded-xl text-xs font-semibold h-9"
          >
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
            className="bg-[#3447AA] rounded-xl font-bold text-xs h-9 px-5"
          >
            New Post
          </Button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Posts', value: activityPosts.length, color: 'text-gray-900' },
          { label: 'Published', value: publishedCount, color: 'text-green-600' },
          { label: 'Drafts', value: draftCount, color: 'text-amber-600' },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center"
          >
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mt-0.5">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Posts list */}
      {activityPosts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center space-y-2">
                <p className="text-gray-500 font-semibold">No activity posts yet</p>
                <p className="text-xs text-gray-400">Click &quot;New Post&quot; to create your first update.</p>
              </div>
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          {activityPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row gap-4"
            >
              {/* Photo thumbnail */}
              {post.photoUrl ? (
                <img
                  src={post.photoUrl}
                  alt={post.title}
                  className="w-full sm:w-32 h-24 object-cover rounded-xl flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full sm:w-32 h-24 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <FileImageOutlined className="text-3xl text-blue-200" />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Tag
                    color={post.published ? 'green' : 'orange'}
                    className="rounded-full text-[10px] font-bold px-2"
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </Tag>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <CalendarOutlined />
                    {dayjs(post.postDate).format('DD MMM YYYY')}
                  </span>
                  {post.createdBy && (
                    <span className="text-[11px] text-gray-400">by {post.createdBy}</span>
                  )}
                </div>

                <h3 className="font-bold text-gray-900 text-sm leading-snug truncate">{post.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{post.body}</p>

                {/* Social link indicators */}
                <div className="flex items-center gap-2 mt-2">
                  {post.fbLink && <FacebookOutlined className="text-blue-600 text-sm" />}
                  {post.instagramLink && <InstagramOutlined className="text-pink-500 text-sm" />}
                  {post.youtubeLink && <YoutubeOutlined className="text-red-600 text-sm" />}
                  {post.xLink && (
                    <span className="px-1.5 py-0.5 rounded bg-gray-900 text-white text-[10px] font-black leading-none">
                      X
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col gap-2 sm:items-end flex-shrink-0">
                <Button
                  size="small"
                  icon={post.published ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  onClick={() => handleTogglePublish(post)}
                  className="rounded-lg text-xs font-semibold"
                >
                  {post.published ? 'Unpublish' : 'Publish'}
                </Button>
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => openEditModal(post)}
                  className="rounded-lg text-xs font-semibold"
                >
                  Edit
                </Button>
                <Popconfirm
                  title="Delete this post?"
                  description="This cannot be undone."
                  onConfirm={() => deleteActivityPost(post.id)}
                  okText="Delete"
                  okButtonProps={{ danger: true }}
                >
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    className="rounded-lg text-xs font-semibold"
                  >
                    Delete
                  </Button>
                </Popconfirm>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        title={
          <span className="font-black text-gray-900">
            {editingPost ? 'Edit Post' : 'Create Activity Post'}
          </span>
        }
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={680}
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            label={<span className="text-xs font-bold text-gray-700">Post Title *</span>}
            name="title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="e.g. Annual Health Camp 2026" size="large" className="rounded-xl" />
          </Form.Item>

          <Form.Item
            label={<span className="text-xs font-bold text-gray-700">Event / Post Date *</span>}
            name="postDate"
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker
              size="large"
              className="rounded-xl w-full"
              format="DD MMM YYYY"
              placeholder="Select date"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-xs font-bold text-gray-700">Photo URL (optional)</span>}
            name="photoUrl"
            extra={
              <span className="text-[11px] text-gray-400">
                Paste a direct image link (e.g. from Google Drive public link, Imgur, or Supabase Storage).
              </span>
            }
          >
            <Input placeholder="https://example.com/photo.jpg" size="large" className="rounded-xl" />
          </Form.Item>

          <Form.Item
            label={<span className="text-xs font-bold text-gray-700">Post Description *</span>}
            name="body"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <TextArea
              placeholder="Describe the event or activity in detail..."
              rows={5}
              className="rounded-xl"
              showCount
              maxLength={2000}
            />
          </Form.Item>

          {/* Social Links */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-4 space-y-3">
            <p className="text-xs font-bold text-gray-700">
              Social Media Links <span className="font-normal text-gray-400">(optional - leave blank to hide)</span>
            </p>
            <Form.Item name="fbLink" className="mb-2">
              <Input
                prefix={<FacebookOutlined className="text-blue-600" />}
                placeholder="Facebook post / page URL"
                className="rounded-xl"
              />
            </Form.Item>
            <Form.Item name="instagramLink" className="mb-2">
              <Input
                prefix={<InstagramOutlined className="text-pink-500" />}
                placeholder="Instagram post URL"
                className="rounded-xl"
              />
            </Form.Item>
            <Form.Item name="youtubeLink" className="mb-2">
              <Input
                prefix={<YoutubeOutlined className="text-red-600" />}
                placeholder="YouTube video URL"
                className="rounded-xl"
              />
            </Form.Item>
            <Form.Item name="xLink" className="mb-0">
              <Input
                prefix={<span className="text-gray-800 text-xs font-black">X</span>}
                placeholder="X (Twitter) post URL"
                className="rounded-xl"
              />
            </Form.Item>
          </div>

          <Form.Item
            label={<span className="text-xs font-bold text-gray-700">Publish Status</span>}
            name="published"
            valuePropName="checked"
          >
            <Switch checkedChildren="Published" unCheckedChildren="Draft" />
          </Form.Item>

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <Button onClick={() => setModalOpen(false)} className="rounded-xl font-semibold">
              Cancel
            </Button>
            <Button
              type="primary"
              loading={saving}
              onClick={handleSave}
              className="bg-[#3447AA] rounded-xl font-bold"
            >
              {editingPost ? 'Save Changes' : 'Create Post'}
            </Button>
          </div>
        </Form>
      </Modal>
    </AdminLayout>
  );
}