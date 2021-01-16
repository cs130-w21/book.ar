# Design Guidelines

The purpose of this document is to provide information and guidelines for designing and writing code for this website in order to ensure consistency and clarity for all contributors, present and future.

As much as possible, the guidelines in this document are enforced by ESLint (for `.ts`. and `.tsx` files) and StyleLint (for `.scss` files).
As such, whenever you commit code, we recommend you run `yarn lint` to ensure that you're adhering to these guidelines.

## General Syntax and Format

* All lines must end in a semicolon.
* Component and interface names, imported assets, static functions, and static variables must be in PascalCase.
* Non-static functions, non-static variables, interface fields, and style classes must be in camelCase.
* Indentation uses two spaces.
* For multiline blocks, opening braces/brackets must be on the same line as the preceding code, while closing braces/brackets must be on their own line.
* For interfaces, JSON files, etc. the last field **must** have a trailing comma in order to have clean file diffs.
* Local `import` statements must use relative file paths.
