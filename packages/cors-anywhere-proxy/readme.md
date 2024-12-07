




## Proxy setup with Caddy
```Caddyfile
domain.proxy.traderdash.app {
        @options {
                method OPTIONS
        }

        header {
                Access-Control-Allow-Origin *
                Access-Control-Allow-Credentials true
                Access-Control-Allow-Methods *
                Access-Control-Allow-Headers *
                defer
        }

        respond @options 204

        reverse_proxy 127.0.0.1:8080 {
                header_up Host {host}
                header_down -Access-Control-Allow-Origin
        }
}
```