export interface HistoryMilestone {
  year: string;
  yearNumber: number;
  periodLabel?: string;
  icon: string;
  accentColor: string; // Tailwind color theme
  bn: {
    title: string;
    tagline: string;
    story: string[];
    quote?: string;
    bulletPoints?: string[];
    donors?: string[];
    significance: string;
    badge?: string;
  };
  en: {
    title: string;
    tagline: string;
    story: string[];
    quote?: string;
    bulletPoints?: string[];
    donors?: string[];
    significance: string;
    badge?: string;
  };
}

export const HISTORY_INTRO = {
  bn: {
    badge: '🕰️ আমাদের ইতিহাসের পথচলা • ১৯৩২ — ২০২৬',
    title: 'একটি মন্দির থেকে আজকের KPNS',
    subtitle: 'প্রায় এক শতাব্দীর আত্মত্যাগ, গ্রামীণ ঐক্য ও সমাজসেবার জীবন্ত ইতিহাস',
    leadQuote:
      'একটি মন্দির থেকে একটি সংগঠন,\nএকটি ছোট মাটির ঘর থেকে একটি সামাজিক প্রতিষ্ঠান,\nআর একটি খেজুরদা নারায়ণ সংঘ থেকে আজকের KPNS।',
    leadDescription:
      'প্রায় এক শতাব্দীর এই গৌরবময় পথচলা আমাদের এলাকার মানুষের ঐক্য, নিঃস্বার্থ সহযোগিতা, অবিচল সমাজসেবা এবং আগামী প্রজন্মের প্রতি দায়বদ্ধতার এক অমর সাক্ষ্য বহন করে।',
  },
  en: {
    badge: '🕰️ The Journey of Our History • 1932 — 2026',
    title: 'From a Sacred Shrine to Modern KPNS',
    subtitle: 'A Century of Voluntary Sacrifice, Community Unity & Dedicated Social Service',
    leadQuote:
      'From a sacred temple to an organized movement,\nfrom a humble mud hut to a vital community institution,\nand from Khejurda Narayan Sangha to today\'s KPNS.',
    leadDescription:
      'Spanning nearly a hundred years, this glorious journey stands as a living testament to the solidarity, selfless cooperation, humanitarian service, and profound responsibility toward future generations demonstrated by the people of our locality.',
  },
};

export const HISTORY_TIMELINE: HistoryMilestone[] = [
  {
    year: '১৯৩২',
    yearNumber: 1932,
    periodLabel: '1932',
    icon: '🛕',
    accentColor: 'amber',
    bn: {
      title: 'নারায়ণ মন্দিরের সূচনা',
      tagline: 'ভক্তি, মুষ্টি ভিক্ষা ও গ্রামীণ ঐক্যের প্রথম ভিত্তিপ্রস্তর',
      story: [
        'এলাকার বয়স্ক ও প্রবীণ মানুষদের পরম নিষ্ঠাবান উদ্যোগে এবং প্রতিটি গ্রামীণ পরিবার থেকে মুষ্টি ভিক্ষার মাধ্যমে সংগৃহীত চাল ও অর্থে একটি মন্দির নির্মাণ করা হয়।',
        'সেই মন্দিরের নাম রাখা হয়— “নারায়ণ মন্দির”।',
        'এই পবিত্র মন্দিরকে কেন্দ্র করেই পরবর্তীকালে এলাকার মানুষের মেলামেশা, পারস্পরিক সৌহার্দ্য এবং সামাজিক ও সাংস্কৃতিক কর্মকাণ্ডের একটি সুদৃঢ় ভিত্তি গড়ে ওঠে।',
      ],
      significance: 'এটাই ছিল আমাদের পরবর্তী সংগঠিত প্রাতিষ্ঠানিক পথচলার সর্বপ্রথম ভিত্তিপ্রস্তর।',
    },
    en: {
      title: 'The Genesis of Narayan Mandir',
      tagline: 'Devotion, "Mushti Bhiksha" (Handful of Rice) & The First Community Seed',
      story: [
        'Under the pious initiative of village elders and revered seniors, funded grain by grain through "Mushti Bhiksha" (traditional voluntary handfuls of rice collected from every rural doorstep), a community temple was erected.',
        'The sacred sanctuary was christened "Narayan Mandir".',
        'Around this sanctum grew the spirit of fellowship, trust, and the social bedrock that would sustain all future community endeavors of Khejurda.',
      ],
      significance: 'This sacred temple laid the very first spiritual and organizational foundation of our community journey.',
    },
  },
  {
    year: '১৯৩৫',
    yearNumber: 1935,
    periodLabel: '1935',
    icon: '🌱',
    accentColor: 'emerald',
    bn: {
      title: '“খেজুরদা নারায়ণ সংঘ”-এর জন্ম',
      tagline: 'ক্রীড়া, সংস্কৃতি ও সংগঠিত সমাজসেবার প্রাতিষ্ঠানিক সূচনা',
      story: [
        'এলাকার উদ্যমী তরুণরা উপলব্ধি করেন যে, শুধুমাত্র পূজা-পার্বণের আচার-অনুষ্ঠানের মধ্যে সীমাবদ্ধ না থেকে সমাজের উন্নয়ন ও যুবশক্তির বিকাশের জন্য আরও বৃহত্তর পরিসরে কাজ করা প্রয়োজন।',
        'এই মহৎ চিন্তা থেকেই তরুণদের অদম্য উদ্যোগে আনুষ্ঠানিকভাবে গড়ে ওঠে— “খেজুরদা নারায়ণ সংঘ”। শুরু হয় আমাদের আনুষ্ঠানিক সাংগঠনিক পথচলা।',
        'সেই সময়ের সংঘের প্রধান প্রাণবন্ত কার্যক্রমের মধ্যে ছিল পল্লী ক্রীড়ার বিকাশ, নাট্যচর্চা এবং বিভিন্ন সামাজিক প্রতিযোগিতায় অংশগ্রহণ।',
      ],
      bulletPoints: [
        '🤼 ঐতিহ্যবাহী কবাডি খেলা ও টুর্নামেন্ট',
        '🏐 নিয়মিত ভলিবল অনুশীলন ও প্রতিযোগিতা',
        '🎭 সামাজিক সচেতনতামূলক লোকনাট্য ও যাত্রা অনুষ্ঠান',
        '🏆 পার্শ্ববর্তী বিভিন্ন অঞ্চলে আয়োজিত টুর্নামেন্টে অংশগ্রহণ ও গৌরবময় বিজয়',
      ],
      significance: 'ধর্মীয় কর্মকাণ্ডের গণ্ডি পেরিয়ে একটি সংগঠিত সামাজিক, ক্রীড়া ও সাংস্কৃতিক সংগঠনের ঐতিহাসিক যাত্রা শুরু হয়।',
    },
    en: {
      title: 'Birth of "Khejurda Narayan Sangha"',
      tagline: 'The Dawn of Organized Sports, Culture & Youth Empowerment',
      story: [
        'The forward-looking youth of the village realized that communal life must extend beyond temple worship into active civic progress and youth empowerment.',
        'Driven by this progressive vision, the youth formally established "Khejurda Narayan Sangha" in 1935, marking the birth of our organized movement.',
        'The early era flourished through vibrant rural sports, traditional folk theater, and widespread competitive participation.',
      ],
      bulletPoints: [
        '🤼 Traditional Kabaddi championships and local tournaments',
        '🏐 Competitive Volleyball training and inter-village matches',
        '🎭 Folk drama and traditional Jatra theatrical performances',
        '🏆 Competing in regional arenas and winning coveted laurels and trophies',
      ],
      significance: 'Transcending religious rituals, a secular, youth-powered institution for sports and social welfare was permanently founded.',
    },
  },
  {
    year: '১৯৫০',
    yearNumber: 1950,
    periodLabel: '1950',
    icon: '🏡',
    accentColor: 'indigo',
    bn: {
      title: 'প্রথম ক্লাবঘরের স্বপ্ন ও আত্মপ্রকাশ',
      tagline: 'পিতৃসম রামজীবন মাইতি মহাশয়ের অনুপ্রেরণা ও মাটির ঘর',
      story: [
        '১৯৫০ সালে এলাকার একজন সম্মানীয় ব্যক্তিত্ব এবং আমাদের সকলের কাছে পরম শ্রদ্ধেয় পিতৃসম রামজীবন মাইতি মহাশয় ক্লাবের জন্য একটি নিজস্ব গৃহ নির্মাণে প্রধান পৃষ্ঠপোষক ও পথপ্রদর্শক হিসেবে এগিয়ে আসেন।',
        'তাঁর স্নেহময় অনুপ্রেরণা এবং এলাকার মানুষের সম্মিলিত শ্রম ও ভালোবাসায় নির্মিত হয় আমাদের ঐতিহাসিক— ছোট্ট মাটির ক্লাবঘর।',
        'সেই ছোট্ট মাটির ঘর থেকেই ক্লাবের সদস্যরা খেলাধুলা, পল্লীসংস্কৃতি এবং এলাকার নানা সেবামূলক কর্মকাণ্ড পরিচালিত করতে থাকেন।',
      ],
      donors: ['শ্রদ্ধেয় পিতৃসম ব্যক্তিত্ব রামজীবন মাইতি মহাশয় ও সর্বস্তরের গ্রামবাসী'],
      significance: 'ছোট হলেও এই মাটির ঘরটি ছিল আমাদের সংগঠনের প্রথম নিজস্ব স্বাধীন ঠিকানা এবং ভবিষ্যৎ পথচলার অক্ষয় প্রতীক।',
    },
    en: {
      title: 'The Dream of the First Club House',
      tagline: 'Patronage of Revered Ramjiban Maity & The Historic Mud Hut',
      story: [
        'In 1950, respected village patriarch and beloved father figure Sri Ramjiban Maity stepped forward with crucial leadership and guidance to give the Sangha a permanent physical abode.',
        'Inspired by his paternal blessings and built through the sweat and voluntary labor of local residents, our historic mud-walled clubhouse was completed.',
        'From within those mud walls, generations of youth gathered for sporting strategies, cultural rehearsals, and rural service drives.',
      ],
      donors: ['Revered Father Figure Sri Ramjiban Maity and the Villagers of Khejurda'],
      significance: 'Though simple and earthen, this room gave the Sangha its first permanent physical address and an identity that withstood the tests of time.',
    },
  },
  {
    year: '১৯৭০',
    yearNumber: 1970,
    periodLabel: '1970',
    icon: '👶',
    accentColor: 'pink',
    bn: {
      title: 'শিশুদের জন্য ক্লাবঘরের নতুন ভূমিকা',
      tagline: 'গ্রামীণ মা ও শিশুদের কল্যাণে আই.সি.ডি.এস (ICDS) অঙ্গনওয়াড়ি সেবা',
      story: [
        'গ্রামীণ এলাকার প্রসূতি মা ও শিশুদের সার্বিক পুষ্টি, স্বাস্থ্যরক্ষা এবং প্রাক-প্রাথমিক শিক্ষার জন্য সরকারের Integrated Child Development Services (ICDS) কার্যক্রমের অংশ হিসেবে আমাদের এলাকায় একটি পরিচালনা কেন্দ্রের জরুরি প্রয়োজন দেখা দেয়।',
        'সেই সংকটময় মুহূর্তে আমাদের ক্লাব সদস্যদের মনে কোনো দ্বিধা ছিল না। ক্লাবের নিজস্ব ঘরটিকে এলাকার শিশুদের কল্যাণে উন্মুক্ত করে দেওয়া হয়।',
        'ICDS-এর যাবতীয় কার্যক্রম, শিশু পরিচর্যা এবং পুষ্টিবণ্টনের জন্য আমাদের ক্লাবঘরটি নিয়মিত ব্যবহৃত হতে থাকে।',
      ],
      significance: 'ক্লাবঘরটি গ্রামীণ শিশুদের কল্যাণে উৎসর্গ করে সংগঠনটি তার নিখাদ সামাজিক দায়বদ্ধতার এক উজ্জ্বল দৃষ্টান্ত স্থাপন করে।',
    },
    en: {
      title: 'A New Mission for Child Welfare',
      tagline: 'Housing the Government ICDS Program for Mothers & Infants',
      story: [
        'When the government\'s Integrated Child Development Services (ICDS) initiative was launched to combat rural malnutrition and provide early childhood education, Khejurda lacked a dedicated facility.',
        'Without hesitation, the club members opened the clubhouse doors, turning the organization’s home into a public welfare haven.',
        'The mud room became the bustling center for childhood immunization, supplementary nutrition, and foundational preschool learning.',
      ],
      significance: 'Demonstrated that club assets exist not merely for recreational leisure, but as public sanctuaries dedicated to grassroots child welfare.',
    },
  },
  {
    year: '১৯৭৭',
    yearNumber: 1977,
    periodLabel: '1977',
    icon: '🌊',
    accentColor: 'blue',
    bn: {
      title: 'বন্যাদুর্গত মানুষের পাশে খেজুরদা নারায়ণ সংঘ',
      tagline: 'দুবদা ও পাহাড়পুর প্লাবনে অদম্য মানবিক প্রতিরোধ ও ত্রাণের ইতিহাস',
      story: [
        '১৯৭৭ সালে দুবদা ও পাহাড়পুর এলাকায় স্মরণকালের এক প্রলয়ঙ্করী বন্যা দেখা দেয়। গ্রামের পর গ্রাম প্লাবিত হয়ে হাজার হাজার মানুষের ঘরবাড়ি জলের তলায় তলিয়ে যায়। বিপন্ন মানুষ নিরাপদ আশ্রয়ের জন্য হাহাকার করতে থাকেন।',
        'সেই চরম দুঃসময়ে নারায়ণ সংঘের তরুণ সদস্যরা হাত গুটিয়ে বসে থাকেননি। তাঁরা রুটি, চিঁড়ে, গুড় ও রান্না করা খাবার কাঁধে তুলে নিয়ে বুকসমান জল ভেঙে দুর্গতদের দ্বারে দ্বারে পৌঁছে যান।',
        'জলস্তর আশঙ্কাজনকভাবে বাড়তে থাকলে প্রশাসনের পক্ষ থেকে ত্রাণ পৌঁছে দেওয়ার জন্য সংগঠনগুলিকে উদ্ধারকারী নৌকা বরাদ্দ করার উদ্যোগ নেওয়া হয়। কিন্তু নিয়ম অনুযায়ী নৌকা পাওয়ার জন্য সংগঠনের সরকারি “রেজিস্ট্রেশন নম্বর” থাকা বাধ্যতামূলক ছিল।',
      ],
      quote: '“একটি সংগঠনকে দীর্ঘমেয়াদে সমাজসেবার কাজে এগিয়ে নিতে হলে তার একটি আনুষ্ঠানিক আইনি রেজিস্ট্রেশন থাকা অত্যন্ত গুরুত্বপূর্ণ।”',
      significance: 'মাঠপর্যায়ের সমাজসেবার পাশাপাশি সংগঠনের আনুষ্ঠানিক পরিচয় ও সরকারি নিবন্ধনের আবশ্যকতা প্রথমবারের মতো তীব্রভাবে অনুধাবিত হয়।',
    },
    en: {
      title: 'Standing by Flood-Hit Communities',
      tagline: 'Heroic Relief in the Dubda-Paharpur Deluge & The Realization of Legal Identity',
      story: [
        'In 1977, catastrophic floods submerged the Dubda and Paharpur regions, wiping away homes and stranding thousands without food, water, or shelter.',
        'In that dark hour, volunteers of Narayan Sangha waded through chest-deep floodwaters carrying dry rations, baked bread, and warm meals to marooned families.',
        'As water levels continued rising, the district administration prepared rescue and relief boats, but regulations mandated an official society "Registration Number" to requisition government boats.',
      ],
      quote: '"For any voluntary movement to deliver sustainable and large-scale humanitarian relief, official statutory registration is indispensable."',
      significance: 'The crucible of the 1977 disaster brought home the absolute necessity of legal incorporation and recognized organizational standing.',
    },
  },
  {
    year: '১৯৭৮',
    yearNumber: 1978,
    periodLabel: '1978',
    icon: '📜',
    accentColor: 'slate',
    bn: {
      title: 'রেজিস্ট্রেশনের প্রস্তুতি ও আইনি পদক্ষেপ',
      tagline: 'অনানুষ্ঠানিক সংগঠন থেকে সরকারি নিবন্ধিত প্রতিষ্ঠানে রূপান্তরের সূচনা',
      story: [
        '১৯৭৭ সালের বন্যার অভিজ্ঞতা সদস্যদের চোখ খুলে দিয়েছিল। সমাজসেবার পরিধিকে আইনের স্বীকৃতি ও প্রশাসনিক সহযোগিতার আওতায় নিয়ে আসার জন্য সর্বসম্মত সিদ্ধান্ত গৃহীত হয়।',
        'সংগঠনের একটি লিখিত গঠনতন্ত্র তৈরি, কার্যনির্বাহী কমিটি গঠন এবং সরকারি নথিপত্র প্রস্তুত করার কাজ পুরোদমে শুরু হয়।',
      ],
      significance: 'একটি গ্রামীণ অনানুষ্ঠানিক যুবসমাজ থেকে একটি আনুষ্ঠানিকভাবে স্বীকৃত ও নিবন্ধিত প্রতিষ্ঠানে পরিণত হওয়ার প্রস্তুতি পর্ব সম্পন্ন হয়।',
    },
    en: {
      title: 'Awakening to Legal Foundations',
      tagline: 'Drafting the Constitution & Preparing for Statutory Recognition',
      story: [
        'The lessons learned during the 1977 floods galvanized the Sangha\'s leadership into action. To ensure government coordination, administrative legitimacy, and uninterrupted public service, formal incorporation became the top priority.',
        'Members drafted a formal society constitution, documented administrative bylaws, and began paperwork for government registration.',
      ],
      significance: 'Marked the decisive bridge between an informal gathering of village youth and an accountable, legally structured institution.',
    },
  },
  {
    year: '১৯৭৯',
    yearNumber: 1979,
    periodLabel: '1979',
    icon: '🏛️',
    accentColor: 'teal',
    bn: {
      title: 'প্রথম রেজিস্ট্রেশন ও ঐতিহাসিক জমি দান',
      tagline: 'কার্তিক চন্দ্র জানা ও দেবেন্দ্রনাথ জানা মহাশয়ের ৬ ডেসিমাল ভূসম্পত্তি অর্পণ',
      story: [
        '১৯৭৯ সালে আমাদের সংগঠন প্রথমবারের মতো সরকারি রেজিস্ট্রেশন নম্বর লাভ করে আনুষ্ঠানিক আইনি স্বীকৃতি অর্জন করে।',
        'এই গৌরবময় বছরেই সংগঠনের ইতিহাসে ঘটে এক অবিস্মরণীয় ঘটনা। ক্লাবের সমাজকল্যাণমূলক কর্মকাণ্ডের প্রতি গভীর শ্রদ্ধা ও আস্থার নিদর্শন হিসেবে এলাকার দুই সুসন্তান শ্রী কার্তিক চন্দ্র জানা এবং শ্রী দেবেন্দ্রনাথ জানা মহাশয় তাঁদের মূল্যবান ৬ ডেসিমাল জমি ক্লাবের নামে নিঃস্বার্থভাবে দান করেন।',
        'তাঁদের এই দূরদর্শী দান সংগঠনের ভবিষ্যৎ পরিকাঠামো ও দীর্ঘমেয়াদী সমাজসেবার স্থায়ী ভিত্তি গড়ে তোলে।',
      ],
      donors: ['১. শ্রী কার্তিক চন্দ্র জানা', '২. শ্রী দেবেন্দ্রনাথ জানা'],
      quote: '“খেজুরদা নারায়ণ সংঘ তথা আমাদের ক্লাব যতদিন পৃথিবীর বুকে থাকবে, ততদিন আমরা পরম শ্রদ্ধার সঙ্গে তাঁদের স্মরণ করব। আমাদের প্রতি তাঁদের আস্থা, ভালোবাসা ও এই মহৎ অবদানের জন্য আমরা চিরকৃতজ্ঞ।”',
      significance: 'সরকারি রেজিস্ট্রেশন এবং নিজস্ব ভূসম্পত্তির মালিকানা লাভ করে ক্লাবের প্রাতিষ্ঠানিক ভিত্তি চিরতরে সুদৃঢ় হয়।',
    },
    en: {
      title: 'First Official Registration & Historic Land Donation',
      tagline: 'Statutory Incorporation & 6 Decimals of Land Donated by Sri Kartik Chandra Jana & Sri Debendranath Jana',
      story: [
        'In 1979, the organization reached a monumental milestone by securing its first official Society Registration Number from the state government.',
        'In the very same historic year, inspired by deep affection and trust in the Sangha’s humanitarian deeds, two noble benefactors—Sri Kartik Chandra Jana and Sri Debendranath Jana—donated 6 decimals of prime land to the organization.',
        'Their magnanimous gift established the permanent foundation for all subsequent community infrastructure and youth welfare projects.',
      ],
      donors: ['1. Sri Kartik Chandra Jana', '2. Sri Debendranath Jana'],
      quote: '"As long as Khejurda Narayan Sangha exists, we shall forever remember their noble deed with veneration. For their boundless faith and generosity, we remain eternally indebted."',
      significance: 'Armed with legal registration and real-estate ownership, the club was permanently rooted in the geography and future of the region.',
    },
  },
  {
    year: '১৯৩৯–১৯৯০',
    yearNumber: 1985,
    periodLabel: '1939–1990',
    icon: '🧗‍♂️',
    accentColor: 'purple',
    bn: {
      title: 'বাধা পেরিয়ে ধারাবাহিক পথচলা',
      tagline: 'অর্ধশতাব্দীর সংগ্রাম, প্রতিকূলতা জয় ও মাটির ঘরের আলো',
      story: [
        'রেজিস্ট্রেশনের পর থেকে আমাদের সংগঠন তার সুস্পষ্ট লক্ষ্য নিয়ে এগিয়ে চলতে থাকে। কিন্তু পথটি সহজ ছিল না; পথে এসেছে নানা সামাজিক, আর্থিক ও রাজনৈতিক বাধা-বিপত্তি ও প্রতিকূলতা।',
        'সদস্যদের অটুট একতা, এলাকার মানুষের অকৃত্রিম সহযোগিতা এবং ক্লাবের প্রতি ভালোবাসার শক্তিতে কোনো বাধাই আমাদের পথচলাকে স্তব্ধ করতে পারেনি।',
        'আমাদের সেই ছোট্ট মাটির ঘরটি হয়ে ওঠে প্রতিটি সংকটে আশার বাতিঘর—গ্রামের যুবকদের প্রশিক্ষণ, সামাজিক মিলনমেলা এবং সাংস্কৃতিক চেতনার কেন্দ্রবিন্দু।',
      ],
      significance: 'প্রজন্মের পর প্রজন্ম প্রতিকূলতার মধ্যেও গ্রামীণ মানুষের সেবায় অবিচল থেকে নিজেদের আদর্শ ও অস্তিত্বকে বাঁচিয়ে রেখেছে।',
    },
    en: {
      title: 'Weathering Storms Across Decades',
      tagline: 'Half a Century of Resilience, Fraternity & The Enduring Mud Clubhouse',
      story: [
        'Following registration, the organization pursued its mission with unwavering clarity. Yet the path was fraught with economic downturns, socio-political upheavals, and regional hardships.',
        'Through the iron solidarity of members, the generous cooperation of villagers, and pure communal love, no obstacle could derail the Sangha.',
        'The humble mud clubhouse stood as a resilient fortress—a hub for intellectual debates, rural sports, community welfare meetings, and brotherhood.',
      ],
      significance: 'Demonstrated enduring grassroots resilience, keeping the torch of service burning brightly across multiple generations.',
    },
  },
  {
    year: '২০০১',
    yearNumber: 2001,
    periodLabel: '2001',
    icon: '📚',
    accentColor: 'cyan',
    bn: {
      title: 'নিরক্ষরতা দূরীকরণে আমাদের ক্লাবঘর',
      tagline: '“সর্ব শিক্ষা অভিযান” ও বয়স্ক শিক্ষার উন্মুক্ত সান্ধ্য পাঠশালা',
      story: [
        '২০০১ সালে ভারত সরকারের পক্ষ থেকে সর্বজনীন সাক্ষরতার লক্ষ্যে “সর্ব শিক্ষা অভিযান”-এর উদ্যোগ নেওয়া হয়। এই প্রকল্পের আওতায় আমাদের এলাকায়ও শিক্ষার আলো ছড়িয়ে দেওয়া ও নিরক্ষরতা দূরীকরণের বিশেষ কার্যক্রম শুরু হয়।',
        'সরকারের পক্ষ থেকে প্রশিক্ষিত স্থানীয় নিবেদিতপ্রাণ স্বেচ্ছাসেবকেরা গ্রামের আনাচে-কানাচে গিয়ে নিরক্ষর মানুষদের শিক্ষার আলোয় নিয়ে আসার জন্য দিনরাত কাজ করতে থাকেন।',
        'আমাদের ছোট্ট মাটির ক্লাবঘরটি তখন হয়ে ওঠে এক বিশেষ পাঠশালা—যেখানে প্রবীণ ও বয়স্ক মানুষেরা জীবনের প্রথমবার খাতা-কলম হাতে নিয়ে অক্ষরজ্ঞান লাভ করেন।',
      ],
      quote: '“যে ঘর একসময় খেলাধুলা ও সাংস্কৃতিক কর্মকাণ্ডের কেন্দ্র ছিল, সেই ঘরই হয়ে উঠেছিল মানুষের জীবনে শিক্ষার আলো ছড়ানোর পবিত্র কেন্দ্র।”',
      significance: '২০০১ সালে ক্লাবঘরটি প্রমাণ করে যে, সংগঠনের সম্পদ শুধু সদস্যদের জন্য নয়—সমাজের প্রয়োজনে মানুষের কল্যাণে সেটিকে ব্যবহার করাই তার প্রকৃত সার্থকতা।',
    },
    en: {
      title: 'Eradicating Illiteracy — The Club as an Academy',
      tagline: 'The "Sarva Shiksha Abhiyan" & Evening Adult Literacy Schooling',
      story: [
        'In 2001, under the national "Sarva Shiksha Abhiyan" literacy drive, targeted campaigns were initiated across the region to bring the light of learning to every unlettered villager.',
        'Trained village volunteers tirelessly visited homes, motivating adult daily-wage earners and women to learn reading, writing, and arithmetic.',
        'The historic mud clubhouse transformed into an evening adult academy—where illiterate villagers held chalk and slate for the very first time in their lives.',
      ],
      quote: '"The modest room that once echoed with theatrical rehearsals now shone as an illuminating center spreading the sacred flame of literacy."',
      significance: 'Proved once more that an organization’s assets find their highest purpose when deployed directly to eradicate societal deprivation.',
    },
  },
  {
    year: '২০০৯',
    yearNumber: 2009,
    periodLabel: '2009',
    icon: '⚠️',
    accentColor: 'rose',
    bn: {
      title: 'এক কঠিন সত্যের মুখোমুখি ও পুনর্গঠনের ডাক',
      tagline: 'স্যানিটেশন প্রকল্প, রেজিস্ট্রেশন নবীকরণের সংকট ও কঠিন পরীক্ষা',
      story: [
        '২০০৯ সালে বিবেকানন্দ যুব পরিষদ এলাকার ঘরে ঘরে স্বাস্থ্যকর পরিবেশ নিশ্চিত করতে রিং টয়লেট নির্মাণের একটি সরকারি সহায়তা প্রকল্প নিয়ে আমাদের সংগঠনের সঙ্গে যোগাযোগ করে।',
        'প্রকল্পের সুবিধা গ্রহণের জন্য সংগঠনের রেজিস্ট্রেশন নম্বর চাওয়া হলে আমরা আমাদের পুরাতন নম্বর প্রদান করি। তখনই এক কঠিন সত্য উদঘাটিত হয়— দীর্ঘদিন ধরে ক্লাবের রেজিস্ট্রেশন নিয়মিত নবীকরণ করা হয়নি।',
        'আইনগত জটিলতা ও দীর্ঘদিনের Renewal Fee এবং Penalty-র বিপুল পরিমাণ অর্থ সেই সময়ে বহন করা ক্লাবের পক্ষে অসম্ভব হয়ে ওঠে। উপরন্তু নতুন করে রেজিস্ট্রেশন করতে গিয়ে জানা যায়— পুরনো “খেজুরদা নারায়ণ সংঘ” নামটি হুবহু আর নিবন্ধন করা যাবে না।',
      ],
      quote: '“ঐতিহ্যকে বাঁচিয়ে রেখে কীভাবে নতুনভাবে পথচলা শুরু করা যায়?” — এই গভীর সংকটই আমাদের পুনর্গঠনের পথে নিয়ে যায়।',
      significance: 'একটি আপাত সংকটই আমাদের সংগঠনকে নতুন দিগন্তে ও সুসংগঠিত প্রাতিষ্ঠানিক রূপান্তরের দিশা দেখায়।',
    },
    en: {
      title: 'Confronting Reality — The Crucible of Renewal',
      tagline: 'Sanitation Initiative, The Lapsed Registration Crisis & A Decisive Dilemma',
      story: [
        'In 2009, Vivekananda Yuba Parishad approached the club to partner on a government-supported initiative to construct hygienic ring-toilets in village households.',
        'When administrative paperwork required society credentials, an unsettling revelation surfaced: the club’s statutory registration had lapsed due to unfiled renewals over several decades.',
        'The cumulative renewal fees and penal levies amounted to a sum far beyond the means of the village youth. Furthermore, statutory regulations barred re-registering under the exact historical name as a new entity.',
      ],
      quote: '"How could we preserve our cherished heritage while forging a legally compliant future?" — This existential crisis forced an organizational renaissance.',
      significance: 'Rather than facing disbandment, this regulatory crisis spurred the members to unite and engineer a triumphant structural rebirth.',
    },
  },
  {
    year: '২০১০',
    yearNumber: 2010,
    periodLabel: '2010',
    icon: '❤️',
    accentColor: 'blue',
    bn: {
      title: 'ঐতিহ্যকে সঙ্গে নিয়ে নতুন পরিচয়: KPNS',
      tagline: '“খেজুরদা পল্লীউন্নয়ন নারায়ণ সংঘ” রূপে নবজন্ম (রেজিস্ট্রেশন নং: SO168946)',
      story: [
        '২০১০ সালে ক্লাবের সকল সদস্য ও প্রবীণরা সমবেত হয়ে ঐক্যবদ্ধ সিদ্ধান্ত নেন: সংগঠনকে আইনিভাবে আবার নতুন করে রেজিস্ট্রেশন করতে হবে।',
        'কিন্তু “খেজুরদা নারায়ণ সংঘ” নামটি শুধু একটি নাম ছিল না—এর সঙ্গে জড়িয়ে ছিল ৭৫ বছরের ইতিহাস, অশ্রু, ঘাম, রক্ত, স্মৃতি এবং কয়েক প্রজন্মের হৃদয়ের ভালোবাসা। তাই সিদ্ধান্ত নেওয়া হয়— পুরনো নাম বিসর্জন দেওয়া হবে না।',
        'যেহেতু আমাদের কাজই হলো পল্লী সমাজের উন্নয়ন ও মানুষের কল্যাণ, তাই পুরনো নামের সঙ্গে পল্লীউন্নয়ন যুক্ত করে নাম রাখা হয়: “খেজুরদা পল্লীউন্নয়ন নারায়ণ সংঘ” (সংক্ষেপে KPNS)।',
        '২০১০ সাল থেকে আজ পর্যন্ত এই নতুন রেজিস্ট্রেশন প্রতি বছর নিয়মনিষ্ঠভাবে নবীকরণ ও অডিট সম্পন্ন করে পরিচালিত হয়ে আসছে।',
      ],
      badge: 'West Bengal Societies Registration Act, 1961 • Reg. No: SO168946',
      significance: 'পুরনো ঐতিহ্যকে বুকে ধারণ করে নতুন নাম ও স্বচ্ছ আইনি কাঠামোর মধ্য দিয়ে সংগঠনের আধুনিক স্বর্ণযুগের সূচনা হয়।',
    },
    en: {
      title: 'Rebirth with Heritage: KPNS',
      tagline: 'Incorporation as "Khejurda Palliunnyayan Narayan Sangha" (Reg. No: SO168946)',
      story: [
        'In 2010, the general body convened a historic convention and resolved that formal re-registration was paramount.',
        'To the villagers, "Khejurda Narayan Sangha" was not a mere title—it embodied 75 years of collective sweat, sacrifice, and community pride. Discarding it was unthinkable.',
        'Reflecting our primary dedication to rural upliftment, the name was harmoniously expanded to "KHEJURDA PALLIUNNYAYAN NARAYAN SANGHA" (abbreviated as KPNS).',
        'Registered under the West Bengal Societies Registration Act, 1961 (Reg. No: SO168946), this registration and financial audit have been maintained unbroken every single year since 2010.',
      ],
      badge: 'West Bengal Societies Registration Act, 1961 • Reg. No: SO168946',
      significance: 'Honored our foundational roots while instituting modern legal governance, financial transparency, and compliance.',
    },
  },
  {
    year: '২০১৮',
    yearNumber: 2018,
    periodLabel: '2018',
    icon: '🏫',
    accentColor: 'emerald',
    bn: {
      title: 'শিশুদের ভবিষ্যতের জন্য জমি দান',
      tagline: 'পাকা আই.সি.ডি.এস স্কুলভবন নির্মাণের জন্য ৩ ডেসিমাল জমি সরকারের হাতে সমর্পণ',
      story: [
        '২০১৮ সালে সরকারি অনুদানে আমাদের এলাকার অঙ্গনওয়াড়ি আই.সি.ডি.এস কেন্দ্রের জন্য একটি স্থায়ী পাকা স্কুলঘর নির্মাণের অনুমোদন আসে। তবে শর্ত ছিল—এর জন্য কমপক্ষে ৩ ডেসিমাল উপযুক্ত জমি প্রয়োজন।',
        'সেই জমি আমাদের ক্লাবের নিজস্ব অর্জিত সম্পত্তির অংশ ছিল। ক্লাবের সদস্যরা ব্যক্তিস্বার্থ বা ক্লাবের সম্পদের কথা না ভেবে এলাকার ভবিষ্যৎ প্রজন্মের সার্বিক মঙ্গলের কথা ভাবেন।',
        'Managing Committee ও সদস্যদের সর্বসম্মত সিদ্ধান্তে ক্লাবের ৩ ডেসিমাল মূল্যবান জমি সরকারের শিশুকল্যাণ দপ্তরের হাতে রেজিস্ট্রি করে দান করা হয়।',
        'এর ফলেই আজ আমাদের এলাকার ছোট ছোট শিশুরা মাটির ঘরের পরিবর্তে পেয়েছে একটি আধুনিক, সুরক্ষিত ও সুরম্য পাকা স্কুলভবন।',
      ],
      bulletPoints: [
        '🏫 আধুনিক ও স্বাস্থ্যকর পাকা শ্রেণিকক্ষ',
        '🍳 স্বাস্থ্যসম্মত পুষ্টিকর রান্নার সুসজ্জিত রান্নাঘর',
        '🚻 শিশুদের জন্য পৃথক পরিচ্ছন্ন শৌচাগার ব্যবস্থা',
        '👩‍🏫 শিক্ষক ও শিক্ষিকা ও কর্মীদের জন্য নির্দিষ্ট দপ্তর',
        '💧 সার্বক্ষণিক পরিশ্রুত সুপেয় পানীয় জলের আধুনিক ব্যবস্থা',
      ],
      quote: '“ক্লাবের সদস্যদের সেই সিদ্ধান্ত শুধু জমি দান ছিল না—তা ছিল আগামী প্রজন্মের শিক্ষা, স্বাস্থ্য ও সুন্দর ভবিষ্যতের জন্য এক পরম বিনিয়োগ।”',
      significance: 'নিজের সম্পদকে সমাজের ভবিষ্যৎ প্রজন্মের জন্য বিলিয়ে দিয়ে KPNS আত্মত্যাগের এক অনন্য ঐতিহাসিক নজির স্থাপন করে।',
    },
    en: {
      title: 'Donating Prime Land for Child Welfare',
      tagline: 'Gifting 3 Decimals of Land for a Permanent Brick-and-Mortar ICDS School',
      story: [
        'In 2018, the state government sanctioned a modern brick-and-mortar schoolhouse for the local Anganwadi ICDS center, contingent upon the availability of 3 decimals of prime land.',
        'The necessary land was part of the club’s own precious real-estate holdings. Looking beyond institutional self-interest, the members placed the educational future of village infants first.',
        'With unanimous executive approval, the club officially transferred 3 decimals of land to the government for the construction of a permanent child-development complex.',
        'Because of this sacrifice, the toddlers of Khejurda transitioned from fragile earthen surroundings into a vibrant, modern learning haven.',
      ],
      bulletPoints: [
        '🏫 Safe, weather-resistant, fully furnished concrete classrooms',
        '🍳 Dedicated hygienic kitchen for mid-day nutritional meals',
        '🚻 Sanitized, child-friendly separate restrooms',
        '👩‍🏫 Dedicated administrative workspace for Anganwadi workers',
        '💧 Continual access to certified purified drinking water',
      ],
      quote: '"Donating that land was more than a gift of property—it was an enduring investment in the health, dignity, and education of our children."',
      significance: 'KPNS established an inspiring model of civil sacrifice, giving away its own prime property to build the future of the village.',
    },
  },
  {
    year: '২০২৩',
    yearNumber: 2023,
    periodLabel: '2023',
    icon: '🏗️',
    accentColor: 'indigo',
    bn: {
      title: 'নতুন পাকা ক্লাবঘরের স্বপ্ন ও নির্মাণ সূচনা',
      tagline: '৭৩ বছরের পুরনো মাটির ঘরের স্মৃতি বুকে নিয়ে আধুনিক পরিকাঠামো',
      story: [
        '১৯৫০ সালে নির্মিত আমাদের ঐতিহ্যবাহী মাটির ক্লাবঘরটি দীর্ঘ ৭৩ বছরের অক্লান্ত সেবা ও প্রাকৃতিক দুর্যোগের পর চরম ভগ্নপ্রায় অবস্থায় উপনীত হয়। বর্ষাকালে মাটির দেওয়াল ও চালের নিরাপত্তা নিয়ে গভীর উদ্বেগ তৈরি হয়।',
        '২০২৩ সালে ক্লাবের Managing Committee সর্বসম্মত সিদ্ধান্ত নেয়— ক্লাবের গৌরবোজ্জ্বল ঐতিহ্যকে অমর রেখে একটি আধুনিক, টেকসই ও বহুবিধ সুবিধাসম্পন্ন পাকা ক্লাবভবন নির্মাণ করতে হবে।',
        'ক্লাবের সকল সদস্য ও শুভানুধ্যায়ীদের স্বতঃস্ফূর্ত আর্থিক সহায়তা ও স্বেচ্ছাশ্রমে নতুন পাকা ভবনের ভিত্তিপ্রস্তর স্থাপিত হয় এবং নির্মাণকাজ শুরু হয়।',
        'যে মাটির ঘর সমাজসেবা, ক্রীড়া, বন্যাত্রাণ, আইসিডিএস ও নিরক্ষরতা দূরীকরণের মতো ঐতিহাসিক মুহূর্তের সাক্ষী ছিল—তার স্মৃতি চিরকাল আমাদের হৃদয়ে সংরক্ষিত থাকবে।',
      ],
      badge: '🚧 নতুন পাকা ক্লাবঘরের নির্মাণকাজ বর্তমানে দ্রুতগতিতে চলমান',
      significance: 'অতীতের আত্মত্যাগকে শ্রদ্ধা জানিয়ে ভবিষ্যৎ প্রজন্মের জন্য একটি আধুনিক, স্থায়ী ও নিরাপদ সমাজসেবা কেন্দ্র প্রতিষ্ঠার সূচনা।',
    },
    en: {
      title: 'Foundation of the Modern Clubhouse',
      tagline: 'Honoring 73 Years of Mud House Heritage with a Permanent Concrete Hub',
      story: [
        'Having served continuously since 1950, our historic mud-walled clubhouse reached severe structural deterioration after weathering 73 monsoons and coastal storms.',
        'In 2023, the Managing Committee took a bold step forward: to erect a state-of-the-art permanent multi-facility concrete clubhouse that honors past heritage while fulfilling modern needs.',
        'Fueled by generous member contributions and village donations, civil construction commenced with immense community enthusiasm.',
        'The mud home that bore witness to flood relief, sports championships, Anganwadi schooling, and literacy campaigns passes its noble baton to this modern successor.',
      ],
      badge: '🚧 Active Construction of the Modern Clubhouse is Currently Underway',
      significance: 'Preserving historical legacy while crafting an enduring, safe, and modern civic infrastructure for future generations.',
    },
  },
  {
    year: '২০২৬',
    yearNumber: 2026,
    periodLabel: '2026',
    icon: '🌐',
    accentColor: 'blue',
    bn: {
      title: 'ইতিহাস সংরক্ষণের নতুন ডিজিটাল অধ্যায়',
      tagline: 'kpns.in অফিসিয়াল ওয়েবসাইট ও শতবর্ষমুখী ডিজিটাল আর্কাইভ',
      story: [
        '২০২৬ সালে ক্লাবের Managing Committee একটি যুগান্তকারী সিদ্ধান্ত গ্রহণ করে: ক্লাবের ইতিহাস, ঐতিহ্য, সমাজসেবামূলক কর্মকাণ্ড ও হিসাবপত্রকে বিশ্বব্যাপী উন্মুক্ত ও সংরক্ষিত রাখতে একটি নিজস্ব ডিজিটাল ওয়েবসাইট (www.kpns.in) নির্মাণ করা হবে।',
        'এই ওয়েবসাইটের মূল উদ্দেশ্য কেবল একটি ডিজিটাল ঠিকানা তৈরি করা নয়—বরং আমাদের ইতিহাসকে বিশ্বস্ততার সাথে ভবিষ্যৎ প্রজন্মের জন্য চিরতরে সংরক্ষণ করা।',
        'আগামী দিনের উত্তরসূরিরা যেন নির্ভুলভাবে জানতে পারে— কোথা থেকে আমাদের যাত্রা শুরু হয়েছিল, কীভাবে মুষ্টি ভিক্ষার “নারায়ণ মন্দির” থেকে “খেজুরদা নারায়ণ সংঘ”-এর জন্ম হয়েছিল, কীভাবে ১৯৭৭-এর বন্যা ও প্রতিকূলতা পেরিয়ে সংগঠনটি আজ “খেজুরদা পল্লীউন্নয়ন নারায়ণ সংঘ (KPNS)” রূপে মাথা উঁচু করে দাঁড়িয়েছে।',
      ],
      quote: '“অতীত আমাদের শিকড়, বর্তমান আমাদের দায়িত্ব, আর ভবিষ্যৎ আমাদের স্বপ্ন।”',
      significance: 'শতবর্ষের দোরগোড়ায় দাঁড়িয়ে অতীত, বর্তমান এবং ভবিষ্যতের মাঝে এক নিরবচ্ছিন্ন ডিজিটাল সেতুবন্ধন রচিত হলো।',
    },
    en: {
      title: 'The Digital Horizon & Archiving History',
      tagline: 'Official kpns.in Web Portal & Centuries of Heritage Archived Online',
      story: [
        'In 2026, the Managing Committee took a milestone digital leap: launching the official institutional web platform (www.kpns.in) to preserve our legacy, achievements, and transparent records for the entire world.',
        'The vision transcended creating a simple homepage—it was designed as an eternal digital monument to our community’s history.',
        'Future generations of youth will always know the true story: how humble handfuls of rice built a temple, how young sports enthusiasts created a Sangha, how devastating floods demanded a legal charter, and how trials were forged into modern KPNS.',
      ],
      quote: '"The past is our root, the present our duty, and the future our dream."',
      significance: 'Constructing a permanent, worldwide digital bridge connecting nine decades of heritage with tomorrow’s leaders.',
    },
  },
];

export const HISTORY_CONCLUSION = {
  bn: {
    title: 'আমাদের ঐতিহাসিক ঘোষণা ও চিরন্তন অঙ্গীকার',
    poem: [
      'একটি মন্দির থেকে একটি সংগঠন,',
      'একটি ছোট মাটির ঘর থেকে একটি সামাজিক প্রতিষ্ঠান,',
      'বাধা থেকে নতুন পথ,',
      'আর “নারায়ণ সংঘ” থেকে আজকের—',
      'খেজুরদা পল্লীউন্নয়ন নারায়ণ সংঘ (KPNS)।',
    ],
    gratitudeText:
      'এই প্রায় এক শতাব্দীর সুদীর্ঘ পথচলা কোনো একক ব্যক্তির নয়। এটি হাজার হাজার সাধারণ মানুষের নিঃস্বার্থ ভালোবাসা, কঠোর শ্রম, নির্লোভ ত্যাগ, আন্তরিক সহযোগিতা এবং গভীর বিশ্বাসের এক সম্মিলিত অমর ইতিহাস।\n\nযাঁরা এই দীর্ঘ পথচলায় আমাদের পাশে ছিলেন, যাঁরা নিজেদের ভিটেমাটি দান করেছেন, যাঁরা বন্যায় মানুষের পাশে দাঁড়িয়েছেন এবং যাঁরা নিজেদের সামর্থ্য অনুযায়ী এক মুঠো চাল বা এক ফোঁটা ঘাম দিয়ে এই সংগঠনটিকে তিলে তিলে গড়ে তুলেছেন— KPNS তাঁদের সকলের পুণ্য স্মৃতির প্রতি চিরকৃতজ্ঞ।',
    creed: '“অতীত আমাদের শিকড়, বর্তমান আমাদের দায়িত্ব, আর ভবিষ্যৎ আমাদের স্বপ্ন।”',
    mantra: 'আমাদের ইতিহাস বেঁচে থাকুক।\nআমাদের ঐতিহ্য বেঁচে থাকুক।\nআমাদের সমাজসেবার পথচলা প্রজন্ম থেকে প্রজন্মে এগিয়ে চলুক।',
    footerBrand: 'খেজুরদা পল্লীউন্নয়ন নারায়ণ সংঘ (KPNS)',
    footerSub: 'ঐতিহ্যে শিকড় • সমাজসেবায় অঙ্গীকার • ভবিষ্যতের পথে একসঙ্গে',
  },
  en: {
    title: 'Our Historic Manifesto & Eternal Creed',
    poem: [
      'From a sacred temple to an organized movement,',
      'from a humble mud hut to a vital social institution,',
      'from daunting obstacles to triumphant new roads,',
      'and from "Narayan Sangha" to today\'s—',
      'KHEJURDA PALLIUNNYAYAN NARAYAN SANGHA (KPNS).',
    ],
    gratitudeText:
      'This voyage of nearly a century belongs to no single person. It is the living symphony of thousands of villagers, patrons, youth, and elders who contributed their boundless affection, honest labor, sacrificial land, and steadfast devotion.\n\nTo all who walked beside us across floods, regulatory rebirths, and cultural milestones—KPNS bows its head in everlasting gratitude.',
    creed: '"The past is our root, the present our duty, and the future our dream."',
    mantra: 'May our history live on.\nMay our heritage inspire.\nMay our spirit of selfless social service illuminate generation after generation.',
    footerBrand: 'KHEJURDA PALLIUNNYAYAN NARAYAN SANGHA (KPNS)',
    footerSub: 'Rooted in Heritage • Committed to Service • United for the Future',
  },
};
