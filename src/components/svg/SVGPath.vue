<template>
  <path
    :ref="params.id"
    :d="params.d"
    :transform="params.transform || 'matrix(1,0,0,1,0,0)'"
    fill="red"
  />
</template>

<script>
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

export default {
  props: ["params", "container_params", "selected"],
  data() {
    return {
      draggable: false,
    };
  },
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
      onDrag: this.updateTransformDrag,
    });
    // Draggable.create(this_path, {
    //   type: "rotation",
    //   minimumMovement: 0.000000000001,
    //   onDrag: this.updateTransformDrag,
    //   transformOrigin: "50 50",
    // });
    Draggable.get(this_path).disable();
  },
  watch: {
    selected: function (is_selected) {
      const this_path = this.$refs[this.params.id];
      if (is_selected) {
        Draggable.get(this_path).enable();
      } else {
        Draggable.get(this_path).disable();
      }
    },
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