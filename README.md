#Y-Scale Menu Plugin
This is a JBrowse plugin
 
This plugin allows the user to set the position of the y-axis scale for all visible tracks using a dialog with radio buttons (rather than changing via track configuration)

##Install

For JBrowse 1.11.6+ in the _JBrowse/plugins_ folder, type:  
``git clone https://github.com/bhofmei/jbplugin-yscale.git YScaleMenuPlugin``

**or**

downloaded the latest release version at [releases](https://github.com/bhofmei/jbplugin-yscale/releases).  
Unzip the downloaded folder, place in _JBrowse/plugins_, and rename the folder _YScaleMenuPlugin_

##Activate
Add this to _jbrowse.conf_ under `[GENERAL]`:

    [ plugins.YScaleMenuPlugin]
    location = plugins/YScaleMenuPlugin

If that doesn't work, add this to _jbrowse_conf.json_:

    "plugins" : {
        "YScaleMenuPlugin" : { "location" : "plugins/YScaleMenuPlugin" }
    }
    
##Use
Open the dialog box by selecting "Set y-scale position" in the **View** menu. All visible tracks (except sequence tracks) will be displayed as a row with the current configuration checked. Simply toggle the radio buttons for tracks you wish to change and click "Apply".

You can also change the position for all tracks using the checkboxes in the top row. If a checkbox is deselected (ie was checked and clicked to uncheck), y-scale position defaults to "center". 
