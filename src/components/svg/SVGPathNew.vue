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

gsap.registerPlugin(Draggable);
export default {
  props: ["params"],
  mounted() {
    const this_path = this.$refs[this.params.id];
    Draggable.create(this_path, {
      type: "x,y",
      minimumMovement: 0.000000000001,
      onDrag: this.updateTransformDrag,
    });
  },
  methods: {
    updateTransformDrag() {
      const this_path = this.$refs[this.params.id];
      const transform_matrix = this_path.transform.baseVal[0].matrix;
      const transform =
        "matrix(" +
        transform_matrix.a +
        "," +
        transform_matrix.b +
        "," +
        transform_matrix.c +
        "," +
        transform_matrix.d +
        "," +
        transform_matrix.e +
        "," +
        transform_matrix.f +
        ")";
      this.$emit("updateTransform", {
        id: this.params.id,
        transform: transform,
      });
      this.params.transform = transform;
    },
  },
};
</script>

<style scoped>
</style>