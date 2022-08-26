import { TemplateResult, html, render } from "lit-html";

export interface Link {
  name: string;
  link: string;
}

export interface Question {
  /** The actual question, i.e. "Why is the sun hot?" */
  question: string;
  /** The HTML anchor.
   * Given an anchor 'why-sun-hot', the question can be linked to using `faq#why-sun-hot`.
   */
  anchor: string;
  /** The actual answer, i.e. "Because fusion" */
  answer: string | TemplateResult;
  /** Some useful links that the reader can refer to. */
  links?: Link[];
}

/** All the questions displayed on the FAQ */
export const questions = {
  windowsHello: {
    priority: 10,
    question: "Does Internet Identity support Windows Hello?",
    anchor: "windows-hello",
    answer: html`<p class="t-paragraph">
      Yes! Internet Identity supports authenticating via
      ${mkExternalLink({
        href: "https://support.microsoft.com/en-us/windows/learn-about-windows-hello-and-set-it-up-dae28983-8242-bb2a-d3d1-87c9d265a5f0",
        text: "Windows Hello",
      })}.
      If Windows Hello is set up on your PC then Internet Identity will offer
      you to authenticate through Windows Hello.
    </p>`,
    links: [
      {
        name: "Windows Hello Guide for Internet Identity",
        link: "https://sdk.dfinity.org/docs/ic-identity-guide/hello-guide.html",
      },
    ],
  },
  lostDevice: {
    priority: 1,
    question: "If I lose my device, can I still use Internet Identity?",
    anchor: "lost-device",
    answer:
      "If you have an Identity Anchor tied to only one device and you lose that one device, you will be locked out. As a best practice, we recommend adding multiple devices and recovery mechanisms to every Identity Anchor.",
    links: [
      {
        name: "Device Management How-To",
        link: "https://sdk.dfinity.org/docs/ic-identity-guide/auth-how-to.html",
      },
    ],
  },
  moreDevices: {
    priority: 1,
    question: "How do I add more devices to my Identity Anchor?",
    anchor: "more-devices",
    answer:
      "To add more devices to an existing Identity Anchor, please see the guide here:",
    links: [
      {
        name: "How to add a device",
        link: "https://sdk.dfinity.org/docs/ic-identity-guide/auth-how-to.html#_add_a_device",
      },
    ],
  },
  shareIIAnchor: {
    priority: 10,
    question:
      "Does Internet Identity share my anchor or personal information with DApps?",
    anchor: "share-ii-anchor",
    answer:
      'No. Internet Identity uses a different Principal (a "pseudonym") for each DApp that you authenticate to using Internet Identity. Since the pseudonyms Internet Identity generates for you are different for each DApp, DApps cannot use them to track you outside of their realm.',
  },
  invalidSeedphrase: {
    priority: 10,
    question:
      'Why do I get "Invalid Seedphrase" when I try to recover my Identity Anchor?',
    anchor: "invalid-seedphrase",
    answer: html`
      <p class="t-paragraph">
        Most likely, it means that the recovery phrase (also known as seed
        phrase) is not BIP39 compatible.
      </p>

      <p class="t-paragraph">
        A recovery phrase generated by Internet Identity will contain an anchor
        number followed by some words. For instance, "135033 squirrel soccer
        ...". The number is the anchor for which the recovery phrase is
        generated; note that Internet Identity will strip the number before
        trying to recover an Identity, meaning the number is only meant for
        humans!
      </p>

      <p class="t-paragraph">
        What Internet Identity will check, on the other hand, is that the
        remainder (the seed phrase without the anchor) is BIP39-compatible. Do
        note that some BIP39 backup solutions only allow storing the first 4
        letters in accordance with the BIP39 protocol. While BIP39 was designed
        such that only using the first 4 letters of each word, Internet Identity
        will not "re-inflate" the words for you, and you may need to do that in
        order to recover your anchor.
      </p>
    `,
    links: [
      {
        name: "BIP39",
        link: "https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki",
      },
    ],
  },
  opensource: {
    priority: 10,
    question: "Is Internet Identity opensource? Can I contribute?",
    anchor: "opensource",
    answer: html`
      <p class="t-paragraph">
        Both the frontend code and the canister code of Internet Identity are
        opensource! The code is hosted on GitHub:
        ${mkExternalLink({
          href: "https://github.com/dfinity/internet-identity#readme",
          text: "dfinity/internet-identity",
        })}.
        The source code for the Internet Computer, on which Internet Identity
        runs, is also hosted on GitHub:
        ${mkExternalLink({
          href: "https://github.com/dfinity/ic#readme",
          text: "dfinity/ic",
        })}.
      </p>

      <p class="t-paragraph">
        If you'd like to contribute to Internet Identity, please head over to
        the
        ${mkExternalLink({
          href: "https://github.com/dfinity/internet-identity",
          text: "GitHub repository",
        })}
        and check out the
        ${mkExternalLink({
          href: "https://github.com/dfinity/internet-identity/blob/main/CONTRIBUTING.md",
          text: "contributing guidelines",
        })}!
      </p>
    `,
  },
  whatIsRecovery: {
    priority: 10,
    question: "Should I add a recovery mechanism?",
    anchor: "what-is-recovery",
    answer: html`
      <p class="t-paragraph">Yes!</p>

      <p class="t-paragraph">
        Internet Identity uses the
        ${mkExternalLink({
          href: "https://webauthn.guide/",
          text: "WebAuthn standard",
        })}
        support in browser to create cryptographic material that is then used to
        identify <em>you</em> as <em>you</em>. This cryptographic material is
        typically stored in your browser or by your OS in your computer (except
        if you use a dedicated device like a YubiKey). Depending on the browser,
        this cryptographic material may be deleted to make room for something
        else&semi; or your computer may be lost. Either way, it's just too easy
        to lose this cryptographic material, meaning you would lose access to
        your Internet Identity anchor.
      </p>

      <p class="t-paragraph">
        Recovery mechanisms are meant to prevent you from losing access to your
        anchor <em>even if</em> you lose the WebAuthn cryptographic material.
        There are two types of recovery mechanisms: recovery phrases (also
        called seed phrases) and recovery devices. They should be stored safely,
        and only used in case you cannot use regular authentication devices!
      </p>
    `,
  },

  pickRecoveryDevice: {
    priority: 10,
    question: "Is a recovery phrase as safe as a recovery FIDO device?",
    anchor: "pick-recovery-device",
    answer: html`
      <p class="t-paragraph">No.</p>

      <p class="t-paragraph">
        A recovery phrase can be stolen much more easily. Because the recovery
        phrase transits through your browser — when you first generate it and
        when you input it to recover your device — there is room for it to be
        stolen either by your browser, by your OS, or by someone seeing it.
      </p>

      <p class="t-paragraph">
        In contrast, when using a FIDO device like a YubiKey or a Ledger Nano,
        the actual key (the private material) never leaves the device. Instead,
        the device cryptographically proves that it has the private material
        through
        <em>assertion</em> (by signing a challenge with the private material).
        The private material never leaves the device, and never transits through
        your browser (only the "proof" or assertion generated by the device
        which can only be used once). In order to steal the private material,
        the actual FIDO device needs to be physically stolen.
      </p>

      <p class="t-paragraph">
        There can be legitimate worries that the FIDO device will stop working
        (water damage, etc), in which case you wouldn't be able to recover your
        anchor. Some devices (like
        ${mkExternalLink({
          href: "https://www.ledger.com/",
          text: "Ledger's Nano devices",
        })})
        offer to export a "recovery phrase" (unrelated to Internet Identity's
        "recovery phrase") which can be used to clone or restore a device.
      </p>
    `,
  },
};

// The questions, sorted lexicographically (by anchor) and then by Priority.
export const questionsArray = Object.values(questions)
  .sort((a, b) => {
    return a.anchor > b.anchor ? +1 : -1;
  })
  .sort((a, b) => a.priority - b.priority);

// The rendered (list item) question
function renderQuestion(faq: Question) {
  return html`<li class="faq__question c-card">
    <details id=${faq.anchor}>
      <summary class="faq__question-summary">
        <span class="faq__question-summary-text t-link"> ${faq.question} </span>
        <div class="faq__question-underline"></div>
      </summary>
      <div class="l-section">
        <p class="faq__answer">
          ${faq.answer instanceof TemplateResult
            ? faq.answer
            : html`<p>${faq.answer}</p>`}
        </p>
        ${faq.links !== undefined && faq.links.length > 0
          ? renderFaqLinks(faq.links)
          : ""}
      </div>
    </details>
  </li>`;
}

function renderFaqLinks(links: Link[]) {
  return html` <ul class="c-list c-list--bulleted l-section">
    ${Object.values(links)
      .sort((a, b) => {
        return a.link < b.link ? -1 : 1;
      })
      .map(
        (link) =>
          html`<li>
            ${mkExternalLink({ href: link.link, text: `${link.name}` })}
          </li>`
      )}
  </ul>`;
}

/** Make a "safe" link that opens in a new tab with noopener & noreferrer. */
export function mkExternalLink(link: {
  href: string;
  text: string;
}): TemplateResult {
  return html`<a
    rel="noopener noreferrer"
    href="${link.href}"
    class="faq__answer-link t-link"
    target="_blank"
    >${link.text} &#8599;</a
  >`;
}

// The FAQ page
const pageContent = html`
  <style>
    /* briefly flash the question when redirected to a particular question */
    @keyframes flash-question {
      0% {
        background-color: transparent;
      }
      50% {
        background-color: var(--rainbow-orange);
        border-radius: 0.3em;
      }
      100% {
        background-color: transparent;
      }
    }
    :target {
      animation-name: flash-question;
      animation-duration: 3000ms;
    }
    .flash-question {
      animation-name: flash-question;
      animation-duration: 3000ms;
    }
  </style>
  <div
    class="faq__container l-container l-container--wide c-card c-card--highlight"
  >
    <h1 class="faq__title t-title t-title--main">FAQ</h1>
    <ul class="faq__questions c-list l-section">
      ${questionsArray.map((faq) => renderQuestion(faq))}
    </ul>
  </div>
`;

// Open the anchor with id="foo" if the page hash is "#foo"
const openAnchor = (): void => {
  const hashName = location.hash.substring(1);

  if (hashName !== "") {
    const details = document.getElementById(hashName);
    console.log(details);

    if (details) {
      details.setAttribute("open", "");
    }

    // Some browsers (chrome for instance) behave differently depending on:
    // * new page with hash
    // * existing page within which hash is clicked
    // by doing this we always are in the 2nd behavior, which is the one that
    // works for us (actually scrolls to question + flashes question)
    location.hash = "";
    location.hash = "#" + hashName;
  }
};

export const faqView = (): void => {
  document.title = "FAQ | Internet Identity";
  const container = document.getElementById("pageContent") as HTMLElement;
  render(pageContent, container);
  openAnchor(); // needs to happen after DOM was rendered
};
