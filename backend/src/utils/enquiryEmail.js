// Builds the "new enquiry" alert: styled HTML for Gmail and a plain-text copy for mail apps that cannot show it.
// Mail apps ignore <style> blocks, so everything is a table with inline styles.
const escapeHtml = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const PINK = '#FA0073';
const NAVY = '#1B2942';
const GREY = '#4B5669';

module.exports = function enquiryEmail(enquiry) {
  const type = enquiry.enquiryType === 'physiotherapy' ? 'Physiotherapy' : 'Home Care Service';
  const rows = [
    ['Phone', enquiry.phone, `tel:+91${enquiry.phone}`],
    ['Email', enquiry.email, enquiry.email && `mailto:${enquiry.email}`],
    ['Age', enquiry.age],
    ['Gender', enquiry.gender],
    ['Enquiry for', type],
    ['Service', enquiry.serviceName],
  ];

  const text = [
    `Name: ${enquiry.name}`, `Phone: ${enquiry.phone}`, `Email: ${enquiry.email || '-'}`, `Age: ${enquiry.age}`, `Gender: ${enquiry.gender}`,
    `Type: ${type}`, `Service: ${enquiry.serviceName || '-'}`, `Message: ${enquiry.message || '-'}`,
  ].join('\n');

  const rowHtml = rows.map(([label, value, link]) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eef0f4;width:120px;font-size:13px;color:${GREY};">${label}</td>
          <td style="padding:10px 0;border-bottom:1px solid #eef0f4;font-size:15px;color:${NAVY};font-weight:600;">${
  value ? (link ? `<a href="${escapeHtml(link)}" style="color:${NAVY};text-decoration:none;">${escapeHtml(value)}</a>` : escapeHtml(value)) : '<span style="color:#9aa3b2;font-weight:400;">Not given</span>'
}</td>
        </tr>`).join('');

  const messageHtml = enquiry.message
    ? `<tr><td colspan="2" style="padding:18px 0 0;">
         <div style="font-size:13px;color:${GREY};margin-bottom:6px;">Message</div>
         <div style="background:#f6f7fa;border-left:4px solid ${PINK};border-radius:6px;padding:12px 14px;font-size:15px;line-height:1.5;color:${NAVY};white-space:pre-wrap;">${escapeHtml(enquiry.message)}</div>
       </td></tr>`
    : '';

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#f1f3f7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f3f7;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;">
    <tr><td align="center">
      <table role="presentation" width="680" cellpadding="0" cellspacing="0" style="max-width:680px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr><td style="background:${NAVY};padding:22px 28px;">
          <div style="font-size:13px;letter-spacing:1.5px;color:#ffb3d4;font-weight:700;">PAMBAN SWAMI HOME CARE</div>
          <div style="font-size:22px;color:#ffffff;font-weight:700;margin-top:6px;">New callback request</div>
        </td></tr>
        <tr><td style="padding:26px 28px 8px;">
          <div style="font-size:13px;color:${GREY};">From</div>
          <div style="font-size:24px;color:${NAVY};font-weight:700;margin-top:2px;">${escapeHtml(enquiry.name)}</div>
        </td></tr>
        <tr><td style="padding:8px 28px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowHtml}
            ${messageHtml}
          </table>
        </td></tr>
        <tr><td align="center" style="padding:28px;">
          <a href="tel:+91${escapeHtml(enquiry.phone)}" style="display:inline-block;background:${PINK};color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:13px 30px;border-radius:999px;">&#128222; Call ${escapeHtml(enquiry.phone)}</a>
        </td></tr>
        <tr><td style="background:#f6f7fa;padding:14px 28px;font-size:12px;color:#8a93a3;text-align:center;">
          Sent from the website contact form. This enquiry is also saved in the admin panel under Enquiries Received.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return { text, html };
};
