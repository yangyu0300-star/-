import type { LegalPack } from "./legal-types";

export const en: LegalPack = {
  community: {
    updatedAt: "2026-11-10",
    preamble:
      "Welcome to Boxuezhe. This community revolves around a single-chain rebuttal format — every new comment can only reply to the previous one, forming a linked chain of rebuttals. By participating you acknowledge that you have read and agree to the guidelines below.",
    sections: [
      {
        title: "One chain, one relay",
        body: "Under each topic, comments can only attach to the current tail of the chain, forming a strict single link. Every comment you see is a direct rebuttal to the one immediately above it. Once submitted, a comment cannot be edited. You may delete your own topic before anyone has replied to the first comment.",
      },
      {
        title: "Two types of rebuttal",
        body: "Full rebuttal: you disagree with the conclusion of the previous comment as a whole. Partial rebuttal: you agree with part of it, but take issue with a specific paragraph or argument. A partial rebuttal must explicitly state which part you disagree with and cannot distort the original meaning.",
      },
      {
        title: "Prohibited content",
        body: "(1) Content that violates the laws of the People's Republic of China; (2) advertising, traffic diversion, or irrelevant outbound links; (3) personal attacks, insults, or discrimination; (4) spam, copy-paste flooding, or vote manipulation; (5) disclosure of others' private information; (6) incitement of crimes. Upon verification by report, such content will be soft-hidden (placeholder text keeps the chain intact). In severe cases the entire tail of the chain will be removed.",
      },
      {
        title: "One browser cannot add two links in a row",
        body: "To prevent a single user from artificially inflating chain length, the same browser cannot add a new link when the current chain tail was posted from that browser. To continue rebutting, wait for another user to reply to your comment, or use a different browser / device.",
      },
      {
        title: "Reporting and handling",
        body: "A Report button is available under every comment with four reason categories: illegal content, advertising, personal attack, or other. A reported comment is immediately soft-hidden (all visitors see placeholder text). Admins review reports in the backend and decide to restore or permanently remove the content. Reports are logged, but reporters' identities are never disclosed publicly.",
      },
      {
        title: "Administrators' authority",
        body: "Admins may, based on reports or routine review, hide or remove any topic, comment, or chain tail without prior notice. This authority exists solely for content that violates these guidelines — it is not used to suppress viewpoints we disagree with. All admin actions are logged.",
      },
      {
        title: "Voting is only about reasoning",
        body: "The 'Well-reasoned' / 'Flawed argument' buttons under each comment only evaluate whether the rebuttal's logic is rigorous. They do not evaluate whether you agree with the conclusion, and they never affect the order of the chain. If you disagree with a comment's point, reply to it directly instead of voting down.",
      },
      {
        title: "Our commitment",
        body: "Boxuezhe aims to be a home for serious rebuttal. These guidelines may be adjusted as the community evolves; any material change will be announced on the homepage. Questions or suggestions? Contact us by email (address at the bottom of the page).",
      },
    ],
  },

  privacy: {
    updatedAt: "2026-11-10",
    preamble:
      "This policy explains what information Boxuezhe (boxuezhe.cc) collects, how we use it, and how we protect it. We collect as little personal data as possible, and we never sell your on-site behavior to third parties.",
    sections: [
      {
        title: "What we collect",
        body: "(1) Content you submit voluntarily: topic title, summary, body text, comments, nickname (optional, 1–20 characters), deletion password (used only for deleting your own topics, never displayed); (2) Anonymous browser identifier (a UUID stored in localStorage, used for vote deduplication and the one-browser-no-two-links rule); (3) Translation requests you submit — translated text is cached in the database for faster later access. We do not collect IP addresses, real names, email addresses, phone numbers, or require account registration.",
      },
      {
        title: "How we use it",
        body: "Collected content is used exclusively to: display topics and comments, power voting / reporting / deletion-password core features, prevent duplicate voting and consecutive links from the same browser, and improve the community experience. We do not build user profiles, and we do not track you across sites.",
      },
      {
        title: "Third-party services",
        body: "Boxuezhe's backend runs on Supabase (PostgreSQL cloud database). Translation uses Google Translate and MyMemory (no registration required — only the text you request is sent for translation). Their privacy policies are published at supabase.com and mymemory.translated.net respectively. We do not share your nickname or any identity information with either service.",
      },
      {
        title: "Cookies and local storage",
        body: "We write only two types of localStorage entries: interface language preference (1 year expiration), and the anonymous browser identifier (permanent). We do not use ad-tracking cookies, and we do not embed any third-party analytics scripts (such as Google Analytics).",
      },
      {
        title: "Content you control",
        body: "You may delete any topic you created at any time — using either the deletion password you set when posting, or the owner key stored in the browser that created it. Comments cannot be edited or individually deleted, but admins will remove comments that are verified as violating rules. You may also reach us via email to request removal of content you posted.",
      },
      {
        title: "Data security",
        body: "We have enabled Supabase's Row-Level Security (RLS) so the database only accepts writes that an anonymous visitor is explicitly permitted to make. The admin backend is password-protected and every action is logged. However, no internet transmission is 100% secure, and we cannot guarantee that a data breach will never happen.",
      },
      {
        title: "Policy changes",
        body: "Material changes to this policy will be announced on the homepage. Continued use of Boxuezhe after such announcement constitutes consent to the revised policy.",
      },
    ],
  },

  terms: {
    updatedAt: "2026-11-10",
    preamble:
      "Welcome to Boxuezhe. Please read the following Terms of Service carefully before using the site. By accessing or using Boxuezhe you agree to these terms.",
    sections: [
      {
        title: "Service description",
        body: "Boxuezhe provides a discussion platform centered on the single-chain rebuttal format. We do not publish, pre-screen, or endorse any content submitted by users (topics, comments, translation requests).",
      },
      {
        title: "User content and liability",
        body: "You are solely responsible for all content you post on Boxuezhe. You guarantee that your content does not violate any law, infringe any third-party right, and that you have the right to post it. Any claim or penalty arising from content you post is your responsibility alone.",
      },
      {
        title: "Content removal right",
        body: "Boxuezhe has the right (but not the obligation) to hide, remove, or modify any user content, or close / delete an entire topic, at any time based on a report, routine review, legal request, or our own judgment — without prior notice or explanation.",
      },
      {
        title: "We do not adjudicate viewpoints",
        body: "Boxuezhe does not represent, endorse, or guarantee the accuracy of any viewpoint, claim, factual statement, or recommendation posted by users. All content is the poster's personal opinion and does not reflect the position of Boxuezhe's operators.",
      },
      {
        title: "Prohibited uses",
        body: "You may not use Boxuezhe to: (1) violate laws or regulations; (2) send advertising, spam, or irrelevant traffic diversion; (3) interfere with the normal operation of the site or launch attacks against us; (4) circumvent the single-chain format in any way — including but not limited to bypassing the one-browser-no-two-links rule, forging votes, or bulk-posting.",
      },
      {
        title: "Feature changes and interruptions",
        body: "We may change, suspend, or terminate any feature at any time. We may also maintain, upgrade, or migrate the service without prior notice. We are not responsible for any resulting data loss, access interruption, or other damages.",
      },
      {
        title: "Disclaimer of liability",
        body: "To the fullest extent permitted by law, Boxuezhe and its operators are not liable for any indirect, incidental, special, or punitive damages — including but not limited to data loss, loss of profits, or business interruption. This clause applies even if we have been advised of the possibility of such damages.",
      },
      {
        title: "Governing law",
        body: "These terms are governed by and interpreted under the laws of the People's Republic of China. If any provision is held invalid or unenforceable, the remaining provisions continue in full force.",
      },
    ],
  },
};
