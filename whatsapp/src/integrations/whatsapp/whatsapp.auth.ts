import {
  AuthenticationCreds,
  BufferJSON,
  initAuthCreds,
  SignalDataTypeMap,
  WAProto,
  type AuthenticationState,
} from "baileys";

type useWhatsappAuthProps = {
  resetData: () => Promise<any>;
  deleteData: (key: string) => Promise<any>;
  writeData: (key: string, data: any) => Promise<any>;
  readData: (key: string) => Promise<any>;
};

enum Keys {
  creds = "creds",
}

enum KeyTypes {
  appStateSyncKey = "app-state-sync-key",
}

export const useWhatsappAuth = async ({
  resetData: externalResetData,
  deleteData: externalDeleteData,
  writeData: externalWriteData,
  readData: externalReadData,
}: useWhatsappAuthProps): Promise<{
  state: AuthenticationState;
  saveCreds: () => Promise<void>;
  reset: () => Promise<AuthenticationCreds>;
}> => {
  const writeData = (key: string, data: any) => {
    return externalWriteData(key, JSON.stringify(data, BufferJSON.replacer));
  };

  const readData = async (key: string) => {
    try {
      const data = await externalReadData(key);
      return JSON.parse(data, BufferJSON.reviver);
    } catch (error) {}
  };

  const removeData = async (key: string) => {
    try {
      await externalDeleteData(key);
    } catch (error) {}
  };

  let creds: AuthenticationCreds =
    (await readData(Keys.creds)) || initAuthCreds();

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const data: { [_: string]: SignalDataTypeMap[typeof type] } = {};
          await Promise.all(
            ids.map(async (id) => {
              const key = `${type}-${id}`;
              let value = await readData(key);

              if (type === KeyTypes.appStateSyncKey && value) {
                value = WAProto.Message.AppStateSyncKeyData.fromObject(value);
              }

              data[id] = value;
            })
          );

          return data;
        },
        set: async (data) => {
          const tasks: Promise<void>[] = [];
          for (const category in data) {
            for (const id in data[category as keyof SignalDataTypeMap]) {
              const value = data[category as keyof SignalDataTypeMap]?.[id];
              const key = `${category}-${id}`;

              tasks.push(value ? writeData(key, value) : removeData(key));
            }
          }

          await Promise.all(tasks);
        },
      },
    },
    saveCreds: () => {
      return writeData(Keys.creds, creds);
    },
    reset: async () => {
      await externalResetData();
      creds = initAuthCreds();
      return creds;
    },
  };
};
