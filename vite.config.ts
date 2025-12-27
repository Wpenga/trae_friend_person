import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.MODELSCOPE_CONFIG': JSON.stringify({
          Providers: [
            {
              name: "modelscope",
              api_base_url: "https://api-inference.modelscope.cn/v1/chat/completions",
              api_key: "ms-f8467869-c76e-4912-be0b-4786480a01be",
              models: [
                "Qwen/Qwen3-Coder-480B-A35B-Instruct",
                "Qwen/Qwen3-235B-A22B-Thinking-2507",
                "Qwen/Qwen3-110B-Instruct"
              ],
              transformer: {
                use: [
                  [
                    "maxtoken",
                    {
                      max_tokens: 65536
                    }
                  ],
                  "enhancetool"
                ],
                "Qwen/Qwen3-235B-A22B-Thinking-2507": {
                  use: ["reasoning"]
                }
              }
            }
          ],
          Router: {
            default: "modelscope,Qwen/Qwen3-Coder-480B-A35B-Instruct",
            background: "modelscope,Qwen/Qwen3-110B-Instruct",
            think: "modelscope,Qwen/Qwen3-235B-A22B-Thinking-2507",
            longContext: "modelscope,Qwen/Qwen3-Coder-480B-A35B-Instruct",
            longContextThreshold: 60000
          }
        })
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
