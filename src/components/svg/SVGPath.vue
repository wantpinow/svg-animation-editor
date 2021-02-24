<template>
  <path
    :ref="params.id"
    :d="params.d"
    :transform="params.transform || 'matrix(1,0,0,1,0,0)'"
    :fill="params.selected ? 'black' : 'red'"
    @click="select"
  />
</template>

<script>
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

export default {
  props: ["params", "container_params"],
  created() {
    // if no current transform, put it in the middle of the viewbox
    if (!this.params.transform) {
      // ceneter element at (0,0)
      let translate_x = -this.params.bbox.x - this.params.bbox.width / 2;
      let translate_y = -this.params.bbox.y - this.params.bbox.height / 2;

      // move into center of bbox
      translate_x +=
        this.container_params.vb_x + this.container_params.vb_width / 2;
      translate_y +=
        this.container_params.vb_y + this.container_params.vb_height / 2;

      // Apply transform
      this.params.transform =
        "matrix(1,0,0,1," + translate_x + "," + translate_y + ")";

      // TODO RESIZE TO CURRENT WIDTH HEIGHT VBOX
      // CENTER (0,0) -> SCALE DOWN/UP -> MOVE TO CENTER OF BBOX
      // DO THE MATRIX MULTIPLICATIONS
    }
  },
  mounted() {
    const this_path = this.$refs[this.params.id];

    Draggable.create(this_path, {
      type: "x,y",
      minimumMovement: 0.000000000001,
    });
  },
  methods: {
    select() {
      this.$emit("selected");
    },
  },
};
</script>

<style scoped>
</style>