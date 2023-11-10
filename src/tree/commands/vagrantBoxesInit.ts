import * as vscode from "vscode";
import {CommandsFlags} from "../../constants/flags";
import {VagrantBoxProvider} from "../vagrant_boxes";
import {VagrantBoxTreeItem} from "../vagrant_box_item";
import {VagrantService} from "../../services/vagrantService";
import {VagrantCommand} from "./BaseCommand";

const registerVagrantBoxInitCommand = (context: vscode.ExtensionContext, provider: VagrantBoxProvider) => {
  context.subscriptions.push(
    vscode.commands.registerCommand(CommandsFlags.vagrantBoxProviderInit, async (item: VagrantBoxTreeItem) => {
      if (!item) {
        return;
      }
      if (item.name !== "") {
        let machineName = item.name;
        const machineNamePrompt = await vscode.window.showInputBox({
          prompt: "Name of the Virtual Machine?",
          placeHolder: machineName
        });

        if (machineNamePrompt) {
          machineName = machineNamePrompt;
        }

        const isWindowsMachine = await vscode.window.showQuickPick(["Yes", "No"], {
          placeHolder: "Is this a Windows machine?"
        });

        if (!isWindowsMachine) {
          isWindowsMachine === "No";
        }

        if (machineName && isWindowsMachine) {
          vscode.window.withProgress(
            {
              location: vscode.ProgressLocation.Notification,
              title: `Initializing Vagrant box ${item.name}`
            },
            async progress => {
              await VagrantService.init(item.name, machineName, isWindowsMachine === "Yes" ? true : false, context)
                .then(
                  value => {
                    if (!value) {
                      vscode.window.showErrorMessage(`Error initializing Vagrant box ${item.name}`);
                    }
                    vscode.commands.executeCommand(CommandsFlags.treeRefreshVms);
                  },
                  reason => {
                    vscode.window.showErrorMessage(
                      `Error initializing Vagrant box ${item.name}: vagrant exited with code ${reason}`
                    );
                  }
                )
                .catch(reason => {
                  vscode.window.showErrorMessage(
                    `Error initializing Vagrant box ${item.name}: vagrant exited with code ${reason}`
                  );
                });
            }
          );
        }
      }
    })
  );
};

export const VagrantBoxesInitCommand: VagrantCommand = {
  register: registerVagrantBoxInitCommand
};
