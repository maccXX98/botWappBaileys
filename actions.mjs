import { DisconnectReason } from "@whiskeysockets/baileys";

export const actions = {
  [DisconnectReason.badSession]: () => {
    console.log(`Bad Session File, Delete session_auth_info and Scan Again`);
    sock.logout();
  },
  [DisconnectReason.connectionClosed]: reconnect,
  [DisconnectReason.connectionLost]: reconnect,
  [DisconnectReason.connectionReplaced]: () => {
    console.log("Conexión con otra sesión abierta, cierre la sesión actual");
    sock.logout();
  },
  [DisconnectReason.loggedOut]: () => {
    console.log(`Dispositivo cerrado, eliminar session_auth_info y escanear`);
    sock.logout();
  },
  [DisconnectReason.restartRequired]: reconnect,
  [DisconnectReason.timedOut]: reconnect,
};

function reconnect() {
  console.log("Reconectando...");
  connectToWhatsApp();
}
