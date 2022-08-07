import { Button as BTN } from "@mantine/core";

type Button = {
  text: String;
  clickEvent: Function;
  styles?: String | null;
};

function Button(props: Button) {
  const { text, clickEvent, styles } = props;
  return <BTN>asd </BTN>;
}

export default Button;
