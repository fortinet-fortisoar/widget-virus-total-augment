| [Home](../README.md) |
|--------------------------------------------|

# Usage

The **VirusTotal Augment** widget is designed to be display **VirusTotal** report. It can enrich the most common threat observables: files/hashes, domains, IPs and URLs and serves a report with all the context that we have for the observable. It also displays our threat graph for the given observable and any related IoCs.

In addition to the widget report for the pertinent observable, the response includes an object with the last detection ratio for the observable, i.e. how many security vendors flag the item as malicious. This detection ratio can be used as a summary next to the pertinent observable when listing it in your interface, acting as a trigger to then open the full-fledged widget when clicking on it.

It display all VirusTotal details, not just a subset of them. Moreover, it is not constrained to an analysis data dump, it also displays our threat graph for the given observable and any related IoCs.

All the details displayed in the report are pivotable, meaning that your users can search for similar files, jump to other files communicating with the same domain, discover other malware signed with the same authenticode certificate, etc. with a single click.



## VirusTotal Augment Widget Views

### VirusTotal Augment Widget - Edit View

This section details the process to edit the widget and use it.

1. Edit a module's view template (e.g. *Indicators*) and select **Add Widget** button.

2. Select **VirusTotal Augment** from the list to bring up the **VirusTotal Augment** widget's customization modal.

3. Specify the title of the Time Series chart in the **Title** field.

4. Select the files/hashes, domains, IPs or URL field to enrich

    ![](./res/vtAugment_edit.png)

### VirusTotal Augment Widget - List View

![](./res/vtAugment_view.png)
