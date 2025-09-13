import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import {AntDesignVueResolver} from 'unplugin-vue-components/resolvers';
import {PrimeVueResolver} from 'unplugin-vue-components/resolvers';
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import path from 'path';

export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [
                AntDesignVueResolver({
                    importStyle: false, // css in js
                }),
                PrimeVueResolver(),
                ElementPlusResolver()
            ],
        })],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'), // 配置 @ 别名
        }
    },
    server: {
        host: '0.0.0.0',
        proxy: {
            '/api': {
                target: 'http://blog.com',
                changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
})
