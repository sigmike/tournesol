import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export const getForEnv = (object, env) => {
  const result = object[env];
  if (result === undefined) {
    throw new Error(
      `No value found for the environment ${JSON.stringify(env)}`
    );
  }
  return result;
};

export const generateImportWrappers = async (manifest) => {
  await Promise.all(
    manifest['content_scripts'].map(async (contentScript) => {
      await Promise.all(
        contentScript.js.map(async (js, i) => {
          console.log(js);
          const content = `import(chrome.runtime.getURL('../${js}'));`;
          const newJs = join('importWrappers', js);
          const path = join('src', newJs);
          await mkdir(dirname(path), { recursive: true });
          await writeFile(path, content);
          contentScript.js[i] = newJs;
        })
      );
    })
  );
};

export const writeManifest = async (manifest, outputPath) => {
  const content = JSON.stringify(manifest, null, 2);
  await writeFile(outputPath, content);
};
