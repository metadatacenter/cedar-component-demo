# CEDAR Embeddable Editor Demo App - Terminology Server Proxy

This is a sample proxy written in PHP. The reason of this proxy is to hide the user's `apiKey`.
The frontend runs in the browser, without this proxy the `apiKey` would be exposed to the world.

You can replicate the logic of this proxy in any language that you can run on your server.

You need to perform these steps:
1. Read the POST body of the original request
2. Execute a POST to the terminology server endpoint
3. Pass in the original POST body
4. Set the Authorization header with your CEDAR apiKey
5. Return the result verbatim

Please see the comments in `index.php` for further details.

## Install guide for Mac

### Install PHP

    brew install php
    brew services start php

### Configure `nginx`

Add a new host to your `nginx` with the following configuration

```
server {
listen          443 ssl;
    server_name     api-php.cee.metadatacenter.orgx;
    include         cedar/include-ssl.conf;
    add_header      'Access-Control-Allow-Origin' 'demo.cee.metadatacenter.orgx';
    add_header      'Access-Control-Allow-Methods' 'POST';
    add_header      'Access-Control-Allow-Headers' 'Content-Type';
    location / {
        root           /Users/cedar/CEDAR/cedar-cee-demo-api-php;
        try_files      $uri = 404;
        fastcgi_pass   127.0.0.1:9000;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include        fastcgi_params;
        fastcgi_param  CEDAR_CEE_PROXY_API_KEY <YOUR_API_KEY>;
    }
    error_log       /Users/cedar/CEDAR/log/cedar-cee-demo-api-php/nginx-error.log warn;
    access_log      /Users/cedar/CEDAR/log/cedar-cee-demo-api-php/nginx-access.log combined;
}
```

### Set up

* Replace the `<YOUR_API_KEY>` with your value from CEDAR (use only the hexadecimal string, leave out the `apiKey` part)
* Replace the root path  
* Replace the log paths
* Replace the server name, if different
* Replace the 'Access-Control-Allow-Origin' value, if needed
