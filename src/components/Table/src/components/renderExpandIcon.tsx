import { BasicArrow } from '/@/components/Basic';

export default () => {
  return (props: Recordable) => {
    return (
      <BasicArrow
        onClick={(e: Event) => {
          props.onExpand(props.record, e);
        }}
        expand={props.expanded}
      />
    );
  };
};
