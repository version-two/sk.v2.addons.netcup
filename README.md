# Netcup Product Renamer

A Firefox extension that lets you assign custom names to your products on the [netcup Customer Control Panel](https://www.customercontrolpanel.de/).

Netcup uses auto-generated account names like `v2202407229062277287 - VPS 1000 ARM G11 VIE iv` which are hard to tell apart. This extension adds an **Actions** column with a **Rename** button so you can label each product with a meaningful name (e.g. "Production DB", "Staging API").

## Features

- Adds an **Actions** column to the products table
- Inline renaming – click **Rename**, type a name, hit **Save** or **Enter**
- Original name shown on hover
- Names persist in browser local storage
- Works with dynamically loaded content (AJAX)
- No data leaves your browser – everything is stored locally

## Installation

### From Firefox Add-ons (AMO)

*Coming soon*

### Manual installation

1. Clone this repository
2. Open Firefox and go to `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on...**
4. Select the `manifest.json` file

## Usage

1. Navigate to **customercontrolpanel.de** and open the products page
2. Find the **Actions** column added to the product table
3. Click **Rename** next to any product
4. Type your custom name and click **Save** (or press **Enter**)
5. To reset a name, clear the input and save

Hover over any renamed product to see the original name.

## Permissions

- `storage` – to save your custom names locally in the browser

## License

MIT License. Copyright (c) 2026 Version Two.
