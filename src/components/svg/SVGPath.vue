<template>
  <path
    :ref="params.id"
    :d="params.d"
    :transform="params.transform"
    fill="red"
  />
</template>

<script>
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import svg_helpers from "../../js/svg_helpers";

gsap.registerPlugin(Draggable);
export default {
  props: ["params"],
  mounted() {
    this.resetDraggables();
    this.deselectPan();
    this.deselectRotate();
  },
  methods: {
    resetDraggables() {
      const this_path = this.$refs[this.params.id];
      gsap.set(this_path, { transformOrigin: "center center" });
      this.draggable_pan = Draggable.create(this_path, {
        type: "x,y",
        minimumMovement: 0.000000000001,
        onDrag: this.updateTransformDrag,
        onDragStart: this.startDrag,
        onDragEnd: this.endDrag,
      });
      this.draggable_rotate = Draggable.create(this_path, {
        type: "rotation",
        minimumMovement: 0.000000000001,
        tranformOrigin: "50% 50%",
        onDrag: this.updateTransformDrag,
        onDragStart: this.startDrag,
        onDragEnd: this.endDrag,
      });
    },
    startDrag() {
      this.$store.dispatch("startDrag");
    },
    endDrag() {
      this.$store.dispatch("endDrag");
    },
    updateTransformDrag() {
      const this_path = this.$refs[this.params.id];
      const transform_drag = svg_helpers.matrixTransformDictToArray(
        this_path.transform.baseVal[0].matrix
      );
      const transform_drag_str = svg_helpers.matrixTransformArrayToString(
        transform_drag
      );
      this.$store.dispatch("svgElementUpdateTransform", {
        element_id: this.params.id,
        transform: transform_drag_str,
      });
      console.log(transform_drag_str);
    },
    selectPan() {
      this.draggable_pan[0].enable();
    },
    deselectPan() {
      this.draggable_pan[0].disable();
    },
    selectRotate() {
      this.draggable_rotate[0].enable();
    },
    deselectRotate() {
      this.draggable_rotate[0].disable();
    },
  },
};
</script>

<style scoped>
</style>