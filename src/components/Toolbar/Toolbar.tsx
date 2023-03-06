import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { motion } from "framer-motion";
import styles from "./Toolbar.module.css";
import { useUpdateMyPresence } from "../../liveblocks.config";
import { forwardRef } from "react";

const COLORS = [
  "#1a1c2c",
  "#5d275d",
  "#b13e53",
  "#f29cbd",
  "#ef7d57",
  "#ffcd75",
  "#38b764",
];

export function Toolbar() {
  const updatePresence = useUpdateMyPresence();

  const handleColorChange = (color: string) => {
    updatePresence({ color });
  };

  return (
    <ToolbarPrimitive.Root className={styles.root} defaultValue="tomato">
      <RadioGroupPrimitive.Root
        className={styles.radioGroupRoot}
        defaultValue={COLORS[0]}
      >
        {COLORS.map((color) => {
          return (
            <ToolbarPrimitive.Button key={color} asChild>
              <RadioGroupItem
                value={color}
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
              >
                <RadioGroupIndicator id="colors" />
              </RadioGroupItem>
            </ToolbarPrimitive.Button>
          );
        })}
      </RadioGroupPrimitive.Root>
    </ToolbarPrimitive.Root>
  );
}

const RadioGroupItem = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentProps<typeof RadioGroupPrimitive.Item>
>(function RadioGroupContent(props, ref) {
  return (
    <RadioGroupPrimitive.Item {...props} ref={ref} className={styles.item}>
      {props.children}
    </RadioGroupPrimitive.Item>
  );
});

const RadioGroupIndicator = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Indicator>,
  React.ComponentProps<typeof RadioGroupPrimitive.Indicator>
>(function RadioGroupContent(props, ref) {
  return (
    <RadioGroupPrimitive.Indicator {...props} ref={ref} asChild>
      <motion.div
        layoutId={props.id}
        transition={{
          duration: 0.65,
          type: "spring",
        }}
        className={styles.indicator}
      />
    </RadioGroupPrimitive.Indicator>
  );
});
