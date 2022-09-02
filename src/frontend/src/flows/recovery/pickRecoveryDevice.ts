import { html, render } from "lit-html";
import { DeviceData } from "../../../generated/internet_identity_types";
import { startCardAnimation } from "../../utils/animation";

const pageContent = () => html`
  <div class="l-container c-card c-card--bg">
  <div class="c-card-bg">
<canvas class="c-card-bg__canvas" width="32" height="32"></canvas>
</div>
    <h1 class="t-title t-title--main">Choose a device</h1>
    <div class="l-section">
      <h2 class="t-title">Recovery devices</div>
      <ol class="c-list l-section" id="deviceList"></ol>
    </div>
  </div>
`;

export const pickRecoveryDevice = async (
  devices: DeviceData[]
): Promise<DeviceData> => {
  const container = document.getElementById("pageContent") as HTMLElement;
  render(pageContent(), container);
  startCardAnimation();
  return init(devices);
};

export const init = (devices: DeviceData[]): Promise<DeviceData> =>
  new Promise((resolve) => {
    const deviceList = document.getElementById("deviceList") as HTMLElement;
    deviceList.innerHTML = ``;

    const list = document.createElement("ul");

    devices.forEach((device) => {
      const identityElement = document.createElement("li");
      identityElement.className = "deviceItem";
      render(
        html`<li class="deviceItemAlias">
          <button class="c-button c-button--secondary">${device.alias}</button>
        </li>`,
        identityElement
      );
      identityElement.onclick = () => resolve(device);
      list.appendChild(identityElement);
    });
    deviceList.appendChild(list);
  });
