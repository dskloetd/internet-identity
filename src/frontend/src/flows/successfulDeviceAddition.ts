import { html, render } from "lit-html";
import { initLogout, logoutSection } from "../components/logout";
import { AuthenticatedConnection } from "../utils/iiConnection";
import { renderManage } from "./manage";

const pageContent = (name: string) => html`
  <div class="container">
    <h1>Success!</h1>
    <p>You have successfully added your new device.</p>
    <label>
      <strong>Device name:</strong>
      <input
        type="text"
        readonly="readonly"
        class="highlightBox"
        value="${name}"
      />
    </label>
    <button id="manageDevicesButton" class="primary">Manage devices</button>
    ${logoutSection()}
  </div>
`;

export const successfullyAddedDevice = async (
  connection: AuthenticatedConnection,
  name: string,
  userNumber: bigint
): Promise<void> => {
  const container = document.getElementById("pageContent") as HTMLElement;
  render(pageContent(name), container);
  initLogout();
  init(userNumber, connection);
};

const init = async (
  userNumber: bigint,
  connection: AuthenticatedConnection
) => {
  const manageDevicesButton = document.getElementById(
    "manageDevicesButton"
  ) as HTMLButtonElement;
  manageDevicesButton.onclick = () => renderManage(userNumber, connection);
};
