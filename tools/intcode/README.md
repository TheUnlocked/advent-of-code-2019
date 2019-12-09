# IntASM
Instructions are separated by line breaks, and arguments and verbs are separated by whitespace. For example:
```intasm
MUL    @63       34463338   34463338
LESS   @63       @63        34463338
JMPT   @63       53
```
Verbs are case-insensitive.

### Value Argument Table
| Syntax | Examples | Description |
| --- | --- | --- |
| `NUM` | `1000`, `-8`, `0` | The integer `NUM` |
| `@NUM` | `@14`, `@10000`, `@0` |The integer value stored in memory at index `NUM` |
| `@(r+NUM)`, `@(r-NUM)` | `@(r+60)`, `@(r-12)`, `@(r+0)` | The value stored in memory at the index of `NUM` plus the relative base |

### Address Argument Table
| Syntax | Examples | Description |
| --- | --- | --- |
| `@NUM` | `@14`, `@10000`, `@0` | The position `NUM` in memory |
| `@(r+NUM)`, `@(r-NUM)` | `@(r+60)`, `@(r-12)`, `@(r+0)` | The position in memory of `NUM` plus the relative base |

### Verb Table
| Verb | Arguments | Description |
| --- | --- | --- |
| `ADD` | `address` `value1` `value2` | Adds `value1` and `value2` and places the result in `address` |
| `MUL` | `address` `value1` `value2` | Multiplies `value1` and `value2` and places the result in `address` |
| `READ` | `address` | Reads an input (pausing if none is available) and places the input value in `address` |
| `OUT` | `value` | Pushes `value` to the output |
| `JMPT` | `value1` `value2` | Sets the instruction pointer to `value2` if `value1` is non-zero |
| `JMPF` | `value1` `value2` | Sets the instruction pointer to `value2` if `value1` is zero |
| `LESS` | `address` `value1` `value2` | Places `1` in `address` if `value1` is strictly less than `value2`, otherwise places `0` in `address` |
| `EQ` | `address` `value1` `value2` | Places `1` in `address` if `value1` is equal to `value2`, otherwise places `0` in `address` |
| `SHFT` | `value` | Increases the relative base by `value` (or decreases if `value` is negative) |
| `HALT` |  | Halts the program |