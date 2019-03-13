# Install the Prototype Kit

This guide explains how to download and install the Prototype Kit on Windows.

You need a few things set up before you can install the Prototype Kit, like Git Bash and Node.js. If you haven’t already, start by reading [what to do before installing the Prototype Kit](/docs/install/windows-installation-guide/before-you-install).

When you are ready to install it, [download the Prototype Kit as a zip (the download will start straight away when you select this link)](/docs/download).

Do not open it straight away, as you need to create a folder to put it in.

Go to your Documents folder and create a folder called “projects”.

You can now open the Prototype Kit zip file you downloaded. When you’ve done this, you should see a folder called govuk-prototype-kit followed by the version number.

Rename the folder to something that describes your prototype and then move it into your projects folder.

Open Git Bash and go to your prototype folder by entering `cd ~/Documents/projects/` followed by the name of your prototype, like this.

`cd ~/Documents/projects/juggling-licence-prototype`

Now, enter the following command to install the Prototype Kit.

`npm install`

The install can take up to a minute. Whilst it’s installing, you may see some warnings.

[Screenshot showing warning]

This is OK, and you do not need to do anything unless you also get an error, which looks something like this.

[Screenshot showing error].

If you do get an error, you can ask for help on the [#prototype-kit](https://ukgovernmentdigital.slack.com/messages/prototype-kit) channel on cross-government Slack or email govuk-design-system-support@digital.cabinet-office.gov.uk.

**[Next start running the Prototype Kit](/docs/get-started/windows-installation-guide/start-and-stop-the-kit)**