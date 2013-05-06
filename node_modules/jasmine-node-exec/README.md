jasmine-node-support
====================

Jasmine Node Support functions

# Methods

## exec

Exec will execute jasmine-node with the file. This is useful if you run node on the spec file so you can simplify your text editor bindings.

    require("jasmine-node-support").exec(__filename);