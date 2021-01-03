# How To Install Perfception

## Outcome

Perfception CLI is installed on a new machine and ready to be executed.

## Prerequisites

- [node.js](https://nodejs.org/) 10 or above
- [npm](https://www.npmjs.com/)
- [git](https://git-scm.com/)
- Linux or MacOS
- Understanding of command line usage. For example bash.

## Steps

### 1. Clone the Project Repository

Clone the git repository available at Github:

```
https://github.com/dypsilon/perfception
```

### 2. Install npm Dependencies

```
cd perfception
npm install
```

### 3. Optionally Make the CLI Entry Point Available Globally

The easiest way to do this is to link the executable into a directory which is already in the `PATH`:

```
ln -s `realpath cli.js` /usr/local/bin/perfception
```

If this step is omitted, the CLI can be called by providing the full path. For example `/home/user/code/perfception/cli.js collect` instead of `perfception collect`.