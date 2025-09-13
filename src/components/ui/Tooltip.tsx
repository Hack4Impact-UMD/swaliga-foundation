import { Tooltip as RadixTooltip } from "radix-ui";
import styles from './Tooltip.module.css';

function Provider(props: RadixTooltip.TooltipProviderProps) {
  return <RadixTooltip.Provider {...props} />
}

function Root(props: RadixTooltip.TooltipProps) {
  return <div><RadixTooltip.Root {...props} /></div>
}

function Trigger(props: RadixTooltip.TooltipTriggerProps) {
  const { className, ...rest } = props;
  return <RadixTooltip.Trigger className={`${styles.trigger} ${className}`} {...rest} />
}

function Portal(props: RadixTooltip.TooltipPortalProps) {
  return <RadixTooltip.Portal {...props} />
}

function Content(props: RadixTooltip.TooltipContentProps) {
  const { className, ...rest } = props;
  return <RadixTooltip.Content className={`${styles.content} ${className}`} {...rest} />
}

function Arrow(props: RadixTooltip.TooltipArrowProps) {
  return <RadixTooltip.Arrow {...props} />
}

export const Tooltip = { Provider, Root, Trigger, Portal, Content, Arrow };