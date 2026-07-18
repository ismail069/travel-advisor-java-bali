const fs = require('fs');

function update(path, enContent) {
  let text = fs.readFileSync(path, 'utf8');
  // Replace the inside of if (isEn) { return ( ... ); }
  text = text.replace(/if \(isEn\) \{[\s\S]*?return \([\s\S]*?<\/LegalPage>\s*\);\s*\}/, `if (isEn) {\n    return (\n${enContent}\n    );\n  }`);
  fs.writeFileSync(path, text);
}

update('client/app/[locale]/disclaimer/page.jsx', `      <LegalPage title="Disclaimer" description="Limitation of liability.">
        <h2>Travel information</h2><p>Destination conditions, prices, access, operating hours, and policies are subject to change without notice. Always confirm information with management or official authorities.</p>
        <h2>AI Content</h2><p>TripAssistant helps generate ideas, not final decisions. Responses may be inaccurate, incomplete, or not reflect current conditions.</p>
        <h2>Advertising and links</h2><p>The site may display third-party ads or links. The presence of ads does not imply endorsement of every product. Editorial content is not determined by advertisers.</p>
        <h2>Safety</h2><p>Assess your physical capabilities, health conditions, weather, and location risks before engaging in activities. Follow staff instructions and local regulations.</p>
      </LegalPage>`);

update('client/app/[locale]/kebijakan-cookie/page.jsx', `      <LegalPage title="Cookie Policy" description="Cookie usage on this site.">
        <h2>Functional cookies</h2><p>Cookies and local storage may be used to remember traveler names, device identity, language, themes, and consent status. This data supports the features you choose and is not used to sell personal identity.</p>
        <h2>Analytics and advertising</h2><p>If analytics or Google AdSense is enabled, these providers may use cookies for measurement, security, personalization, or ad serving according to your consent choices and applicable regulations.</p>
        <h2>Managing choices</h2><p>You can reject non-essential cookies through the consent banner when available, and delete cookies through browser settings. Some personalization features may not function after data is deleted.</p>
      </LegalPage>`);

update('client/app/[locale]/kebijakan-editorial/page.jsx', `      <LegalPage title="Editorial Policy" description="Our writing standards.">
        <h2>Editorial principles</h2><p>We prioritize clarity, usefulness, transparency, and independence. Articles are created to answer reader needs, not just chase page volume or keywords.</p>
        <h2>Sources and verification</h2><p>Factual information is prioritized from destination management, government, transport operators, or reputable sources. Highly volatile information is marked with reminders to re-verify.</p>
        <h2>AI Usage</h2><p>AI can assist in initial research, structuring, and language checking. Ismail is responsible for reviewing, editing, and deciding on publication. Content is not published automatically without human review.</p>
        <h2>Corrections</h2><p>Material errors are corrected after verification. The update date is displayed on the article. Readers can send corrections via the Contact page.</p>
        <h2>Independence and monetization</h2><p>Ads, affiliations, or commercial collaborations will be clearly labeled and do not buy positive reviews. Editorial and commercial separation is maintained.</p>
      </LegalPage>`);

update('client/app/[locale]/kontak/page.jsx', `      <LegalPage title="Contact" description="Get in touch with us.">
        <h2>Email</h2><p><a className="font-bold text-primary" href={\`mailto:\${CONTACT_EMAIL}\`}>{\`\${CONTACT_EMAIL}\`}</a></p>
        <h2>Information correction</h2><p>Include the page URL, the section that needs correction, a brief explanation, and supporting sources. We will review the input before making changes.</p>
        <h2>Response time</h2><p>This site is managed personally. We strive to respond to relevant messages within a reasonable time, but do not guarantee immediate responses.</p>
      </LegalPage>`);

update('client/app/[locale]/kebijakan-privasi/page.jsx', `      <LegalPage title="Privacy Policy" description="How we handle your data.">
        <h2>Data that may be processed</h2><p>We may process the traveler name you enter, language and theme preferences, conversations with TripAssistant, reviews, basic technical data, and usage data if analytics services are enabled.</p>
        <h2>Purpose of processing</h2><p>Data is used to run features, remember preferences, improve content quality, prevent abuse, and understand site performance. Do not enter sensitive information into the chatbot or reviews.</p>
        <h2>Service providers</h2><p>The site may use Vercel for hosting, Supabase for data storage, Google Gemini for AI request processing, and Google AdSense or analytics services once enabled. Each provider may process data according to their policies.</p>
        <h2>Retention and user choices</h2><p>Local data can be deleted via browser settings. Requests regarding stored data can be sent to <a href={\`mailto:\${CONTACT_EMAIL}\`} className="font-bold text-primary">{\`\${CONTACT_EMAIL}\`}</a>. We may request additional information to verify requests.</p>
        <h2>Policy changes</h2><p>This policy may be updated when features or service providers change. The update date is displayed at the top of the page.</p>
      </LegalPage>`);

update('client/app/[locale]/ketentuan/page.jsx', `      <LegalPage title="Terms of Use" description="Terms and conditions.">
        <h2>Information usage</h2><p>Content is provided for initial information and planning. You are responsible for verifying prices, schedules, weather, safety, permits, and management rules before traveling.</p>
        <h2>TripAssistant AI</h2><p>AI answers may contain errors and are not a substitute for information from authorities, medical professionals, legal advisors, or travel providers. Do not send sensitive personal data.</p>
        <h2>User conduct</h2><p>Users must not send spam, unlawful content, hate speech, others' personal data, or attempt to disrupt systems and APIs.</p>
        <h2>Content rights</h2><p>JawaBali Trip editorial text may not be copied or republished substantially without permission. Trademarks, photos, and third-party sources remain the property of their respective rights holders.</p>
        <h2>Limitation of liability</h2><p>We do not guarantee all information is always complete or up to date and are not responsible for losses resulting from travel decisions made without independent verification.</p>
      </LegalPage>`);

update('client/app/[locale]/atribusi-gambar/page.jsx', `      <LegalPage title="Image Credits" description="Credits for visual creators.">
        <h2>Credits</h2><p>Images used on this site are open-licensed or have been used with permission.</p>
      </LegalPage>`);
