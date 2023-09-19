# React-configuration

React-configuration is a solution for ever-existing problem with environment variables being injected into the application at build time. This requires rebuilding the application every time an env changes.

React-configuration allows for easy setup of runtime variables without any dependencies, server setups or injecting javascript into the window in index.html (which can be very dangerous in terms of security).

Instead, it uses a JSON file with a React ContextProvider to allow for runtime change and overriding of variables.

It works with typescript out of the box.

It also provides an easy solution for overriding environment variables in nginx image in docker [see below](#Overriding-in-nginx-image-in-docker).

### Table of contents
1. [How to use it](#how-to-use-it)
    1. [Installation](#installation)
    2. [Usage](#usage)
2. [Advanced](#advanced)
    1. [Overriding default config locally](#overriding-default-config-locally)
        1. [In Vite](#in-vite)
        2. [In Create-React-App (CRA)](#in-create-react-app-cra)
    2. [Overriding in nginx image in docker](#overriding-in-nginx-image-in-docker)
    3. [Using loadConfig without the ContextProvider](#using-loadconfig-without-the-contextprovider)
3. [Troubleshooting](#troubleshooting)
    1. [Null values](#null-values)

---

## How to use it

### Installation

```bash
npm install @4chain-ag/react-configuration
```

### Usage

1. Create a **`config.default.json`** file in the **`public/`** directory. For example:

```json
{
  "apiUrl": "localhost:8000",
  "otherEnvVariable": "value"
}
```

2. In your **`index.js`** file import and add **`ConfigProvider`**:

```js
import { ConfigProvider } from "@4chain-ag/react-configuration";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ConfigProvider> {/* It will allow to use useConfig hook inside every child component of <App /> */}
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
```

It doesn't have to be an index.js file, you can choose any other file, but config variables will only be available in child components. [Read more about React Context](https://react.dev/learn/passing-data-deeply-with-context)

3. Use **`useConfig`** hook anywhere you need env variables:

```js
import { useConfig } from "@4chain-ag/react-configuration"

export const ShowConfigComponent = () => {
  const { config } = useConfig()

  return (
    <h3>The api url is: {config.apiUrl}</h3>
  )
}
```

---

## Advanced

### Overriding default config locally

#### In Vite

In order to override the config variables in vite, create an **`env-config.json`** file in the root directory of your project:

```json
{
  "apiUrl": "localhost:3000/override/value"
}
```

You can override just one, many or all the variables.

#### In Create-React-App (CRA)

In order to override the config variables in CRA, you need to:

1. Create a **`setupProxy.js`** file in the root of your project and write the following:

```js
const config = require("@4chain-ag/react-configuration");
const express = require("express");

module.exports = config.expressProxy(express);
```

2. Create an **`env-config.json`** file in the root directory of your project:

```json
{
  "apiUrl": "localhost:3000/override/value"
}
```

Just as in Vite, you can override just one, many or all the variables.

---

### Overriding in nginx image in docker

In order to override the config variables in nginx image in docker you need to:

1. Create an **`env-config.json`** file the directory of your choice (doesn't need to be project root)

```json
{
  "apiUrl": "localhost:3000/override/value/docker"
}
```

2. Add a volume with this file to your docker configuration. Example in docker-compose.yml:

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '3000:3000'
    volumes:
      - '/path/to/env-config.json:/usr/share/nginx/html/env-config.json'
```

If the file is in the root folder of the project, it is enough to put just a file:

```yaml
volumes:
  - 'env-config/json:/usr/share/nginx/html/env-config.json'
```

If the file is somewhere else, you need to specify path to file:

```yaml
volumes:
  - '/path/to/env-config/json:/usr/share/nginx/html/env-config.json'
```

---

### Using loadConfig without the ContextProvider

If you don't want to use the useConfig hook inside the ContextProvider, you can just use the async function for loading config from file.

```js
import { loadConfigFromFile } from "@4chain-ag/react-configuration";

const config = await loadConfigFromFile()
```

This function will return the default config from **`config.default.json`** inside the **`public/`** directory or a merged config, if a file **`env-config.json`** is specified in the root directory of the project.

---

## Troubleshooting

### Null values

Null values in javascript/typescript are treated as non-existent, so they are not supported as values that can be overriden. Therefore, avoid null values and try to set default or empty values instead.

```json
{
  "apiUrl": null    // WRONG ❌
  "apiUrl": ""      // CORRECT ✅
}
```
