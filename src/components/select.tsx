import * as React from "react";
import { ipcRenderer } from "electron";
import ReactDOM from "react-dom";
import Button from "@material-ui/core/Button";

export interface HelloProps {
  compiler: string;
  framework: string;
}

async function runCommand(cmd: any) {
  await ipcRenderer.sendSync("open-file-dialog-for-file", cmd);
}

export const Select: React.FC<HelloProps> = ({ compiler, framework }) => (
  <div>
    <h1>
      Hello from {compiler} and {framework}!
    </h1>
    <Button
      variant="contained"
      color="primary"
      onClick={() => runCommand({ t: "test" })}
    >
      Hello World
    </Button>
  </div>
);
