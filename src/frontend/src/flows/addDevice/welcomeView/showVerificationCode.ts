import { html, render } from "lit-html";
import { Connection } from "../../../utils/iiConnection";
import {
  CredentialId,
  Timestamp,
} from "../../../../generated/internet_identity_types";
import { setUserNumber } from "../../../utils/userNumber";
import { setupCountdown } from "../../../utils/countdown";
import { displayError } from "../../../components/displayError";

export type TentativeRegistrationInfo = {
  verification_code: string;
  device_registration_timeout: Timestamp;
};
const pageContent = (
  userNumber: bigint,
  alias: string,
  tentativeRegistrationInfo: TentativeRegistrationInfo
) => html`
  <div class="container">
    <h1>Device Verification Required</h1>
    <p>
      This device was added tentatively to the Identity Anchor
      <strong>${userNumber}</strong>. Log in on an existing device and verify
      this device using the verification code below. After successful
      verification this page will automatically refresh.
    </p>
    <label>
      <strong>Alias</strong>
      <input
        type="text"
        readonly="readonly"
        class="highlightBox"
        value="${alias}"
      />
    </label>
    <label>Device Verification Code</label>
    <input
      id="verificationCode"
      type="text"
      aria-label="host name"
      readonly="readonly"
      class="highlightBox host-name hostName"
      value="${tentativeRegistrationInfo.verification_code}"
    />
    <p>Time remaining: <span id="timer"></span></p>
    <button id="showCodeCancel">Cancel</button>
  </div>
`;

/**
 * Page to display the verification code which is received after successfully registering a tentative device.
 * @param userNumber Anchor the device to be verified belongs to
 * @param alias Alias of the tentative device
 * @param tentativeRegistrationInfo Verification code and timeout received when registering the tentative device
 * @param credentialToBeVerified Credential id of the device to be verified. When this id appears in the list of authenticators, verification was successful.
 */
export const showVerificationCode = async (
  userNumber: bigint,
  connection: Connection,
  alias: string,
  tentativeRegistrationInfo: TentativeRegistrationInfo,
  credentialToBeVerified: CredentialId
): Promise<void> => {
  const container = document.getElementById("pageContent") as HTMLElement;
  render(pageContent(userNumber, alias, tentativeRegistrationInfo), container);
  return init(
    userNumber,
    connection,
    tentativeRegistrationInfo.device_registration_timeout,
    credentialToBeVerified
  );
};

function poll(
  userNumber: bigint,
  connection: Connection,
  credentialToBeVerified: Array<number>,
  shouldStop: () => boolean
): Promise<boolean> {
  return connection.lookupAuthenticators(userNumber).then((deviceData) => {
    if (shouldStop()) {
      return false;
    }
    for (const device of deviceData) {
      if (device.credential_id.length === 1) {
        const credentialId = device.credential_id[0];

        if (credentialIdEqual(credentialId, credentialToBeVerified)) {
          return true;
        }
      }
    }
    return poll(userNumber, connection, credentialToBeVerified, shouldStop);
  });
}

const init = async (
  userNumber: bigint,
  connection: Connection,
  endTimestamp: bigint,
  credentialToBeVerified: CredentialId
): Promise<void> => {
  const countdown = setupCountdown(
    endTimestamp,
    document.getElementById("timer") as HTMLElement,
    async () => {
      await displayError({
        title: "Timeout Reached",
        message:
          'The timeout has been reached. For security reasons the "add device" process has been aborted.',
        primaryButton: "Ok",
      });
      // TODO L2-309: do this without reload
      window.location.reload();
    }
  );
  poll(userNumber, connection, credentialToBeVerified, () =>
    countdown.hasStopped()
  ).then((verified) => {
    if (verified) {
      countdown.stop();
      setUserNumber(userNumber);
      // TODO L2-309: do this without reload
      window.location.reload();
    }
  });

  const cancelButton = document.getElementById(
    "showCodeCancel"
  ) as HTMLButtonElement;

  cancelButton.onclick = () => {
    countdown.stop();
    // TODO L2-309: do this without reload
    window.location.reload();
  };
};

function credentialIdEqual(
  credentialId1: CredentialId,
  credentialId2: CredentialId
): boolean {
  if (credentialId1.length !== credentialId2.length) {
    return false;
  }
  return credentialId1.every((elem, index) => elem === credentialId2[index]);
}
