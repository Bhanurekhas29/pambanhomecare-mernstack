// Each entry drives a Django-admin style list + add/edit form for one API resource.
// Adding a new section later (services, testimonials...) is one more entry here.
const PLATFORM_LABELS = {
  whatsapp: 'WhatsApp',
  call: 'Call',
  email: 'Email',
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  location: 'Location (Google Maps)',
};

export const resources = {
  users: {
    endpoint: '/admin/users',
    title: 'Users',
    singular: 'User',
    columns: [
      { key: 'username', label: 'Username' },
      { key: 'email', label: 'Email' },
      { key: 'isActive', label: 'Active', type: 'bool' },
      { key: 'createdAt', label: 'Created', type: 'date', hideOnMobile: true },
    ],
    fields: [
      { name: 'username', label: 'Username', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', hint: 'Used for password reset links' },
      {
        name: 'password', label: 'Password', type: 'password', secret: true, requiredOnCreate: true,
        hint: 'At least 8 characters. When editing, leave blank to keep the current password.',
      },
      { name: 'isActive', label: 'Active', type: 'checkbox', default: true },
    ],
  },
  services: {
    endpoint: '/admin/services',
    title: 'Services',
    singular: 'Service',
    reorderable: true,
    extraAction: { label: 'Edit section heading', to: '/services-section' },
    columns: [
      { key: 'imageUrl', label: 'Photo', type: 'image' },
      { key: 'title', label: 'Service' },
      { key: 'isWide', label: 'Wide card', type: 'bool', hideOnMobile: true },
      { key: 'isActive', label: 'Visible', type: 'bool', hideOnMobile: true },
    ],
    fields: [
      { name: 'title', label: 'Service name', type: 'text', required: true },
      { name: 'icon', label: 'Icon', type: 'icon' },
      { name: 'imageUrl', label: 'Photo', type: 'image', hint: 'Landscape photo works best. Shown behind the service name.' },
      {
        name: 'isWide', label: 'Show as a wide card with a description', type: 'checkbox', default: false,
        hint: 'Wide cards show a paragraph of text beside the photo, like "Medicine Assistance".',
      },
      {
        name: 'description', label: 'Description', type: 'textarea', required: true,
        showIf: (values) => values.isWide,
      },
      { name: 'isActive', label: 'Show on website', type: 'checkbox', default: true },
    ],
  },
  physiotherapy: {
    endpoint: '/admin/physiotherapy',
    title: 'Physiotherapy',
    singular: 'Treatment',
    reorderable: true,
    extraAction: { label: 'Edit section heading', to: '/physiotherapy-section' },
    columns: [
      { key: 'imageUrl', label: 'Photo', type: 'image' },
      { key: 'title', label: 'Treatment' },
      { key: 'isActive', label: 'Visible', type: 'bool', hideOnMobile: true },
    ],
    fields: [
      { name: 'title', label: 'Treatment name', type: 'text', required: true },
      { name: 'icon', label: 'Icon', type: 'icon' },
      { name: 'imageUrl', label: 'Photo', type: 'image', hint: 'Landscape photo works best. Shown behind the treatment name.' },
      { name: 'isActive', label: 'Show on website', type: 'checkbox', default: true },
    ],
  },
  enquiries: {
    endpoint: '/admin/enquiries',
    title: 'Enquiries Received',
    singular: 'Enquiry',
    editTitle: 'Enquiry details',
    noAdd: true, // enquiries come from the website form
    emptyText: 'No enquiries yet. They appear here when someone sends the Contact Us form.',
    columns: [
      { key: 'createdAt', label: 'Received', type: 'datetime', hideOnMobile: true },
      { key: 'name', label: 'Name', link: true },
      { key: 'phone', label: 'Mobile', nowrap: true },
      { key: 'serviceName', label: 'Service', hideOnMobile: true },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { name: 'status', label: 'Status', type: 'select', hint: 'Mark it Contacted once you have called back.', options: [
        { value: 'new', label: 'New' }, { value: 'contacted', label: 'Contacted' }, { value: 'closed', label: 'Closed' },
      ] },
      { name: 'name', label: 'Full name', type: 'readonly' },
      { name: 'phone', label: 'Mobile number', type: 'readonly' },
      { name: 'email', label: 'Email', type: 'readonly' },
      { name: 'age', label: 'Age', type: 'readonly' },
      { name: 'gender', label: 'Gender', type: 'readonly' },
      {
        name: 'enquiryType', label: 'Enquiry for', type: 'readonly',
        format: (v) => (v === 'physiotherapy' ? 'Physiotherapy' : 'Home Care Service'),
      },
      { name: 'serviceName', label: 'Service required', type: 'readonly' },
      { name: 'message', label: 'Message', type: 'readonly' },
      {
        name: 'createdAt', label: 'Received on', type: 'readonly',
        format: (v) => (v ? new Date(v).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' }) : ''),
      },
    ],
  },
  'floating-icons': {
    endpoint: '/admin/floating-icons',
    title: 'Floating Icons',
    singular: 'Icon',
    reorderable: true,
    emptyText: 'No floating icons yet. Add WhatsApp and Call so visitors can reach you from any part of the page.',
    columns: [
      { key: 'platform', label: 'Icon', link: true, format: (v) => PLATFORM_LABELS[v] || v },
      { key: 'label', label: 'Name', hideOnMobile: true },
      { key: 'value', label: 'Number / link', nowrap: true },
      { key: 'isActive', label: 'Visible', type: 'bool', hideOnMobile: true },
    ],
    fields: [
      {
        name: 'platform', label: 'Icon type', type: 'select', default: 'whatsapp', required: true,
        hint: 'These icons float on the side of every page of the website.',
        options: Object.entries(PLATFORM_LABELS).map(([value, label]) => ({ value, label })),
      },
      {
        name: 'value', type: 'text', required: true,
        label: (v) => (['call', 'whatsapp'].includes(v.platform) ? 'Mobile number' : v.platform === 'email' ? 'Email address' : 'Link (https://...)'),
        hint: (v) => (['call', 'whatsapp'].includes(v.platform)
          ? '10-digit mobile number, e.g. 9876543210'
          : v.platform === 'email' ? 'e.g. hello@yourdomain.com' : 'The full page link, starting with https://'),
      },
      {
        name: 'message', label: 'Opening message', type: 'textarea', showIf: (v) => v.platform === 'whatsapp',
        hint: 'Optional text already typed in when the visitor opens WhatsApp, e.g. "Hello, I need home care."',
      },
      { name: 'label', label: 'Name shown on hover', type: 'text', hint: 'Optional, e.g. "Chat on WhatsApp"' },
      { name: 'isActive', label: 'Show on website', type: 'checkbox', default: true },
    ],
  },
  menu: {
    endpoint: '/admin/menu',
    title: 'Menu',
    singular: 'Menu item',
    reorderable: true, // rows can be dragged; order saves automatically
    columns: [
      { key: 'label', label: 'Label' },
      { key: 'link', label: 'Link' },
      { key: 'isActive', label: 'Visible', type: 'bool' },
    ],
    fields: [
      { name: 'label', label: 'Menu name', type: 'text', required: true },
      { name: 'link', label: 'Link', type: 'text', required: true, hint: 'A section like #about, or a page like /contact' },
      { name: 'isActive', label: 'Visible on website', type: 'checkbox', default: true },
    ],
  },
};
