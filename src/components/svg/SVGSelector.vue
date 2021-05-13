<template>
  <g>
    <circle
      id="slider"
      :cx="foo1"
      :cy="foo2"
      r="0.2"
      fill="purple"
      transform="matrix(1,0,0,1,0,0)"
      ref="slider"
    />
  </g>
</template>

<script>
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import svg_helpers from "../../js/svg_helpers";

gsap.registerPlugin(Draggable);
export default {
  props: ["id", "rotating"],
  data() {
    return {
      foo1: 5,
      foo2: 5,
    };
  },
  mounted() {
    Draggable.create("#slider", {
      type: "x,y",
      minimumMovement: 0.000000000001,
      onDrag: this.dragSlider,
    });
  },
  computed: {
    element() {
      return this.$store.getters.svgElement(this.id);
    },
    bboxTransformed() {
      const e = this.element;
      return e.bboxTransformed;
    },
    transform() {
      const e = this.element;
      return e.transform;
    },
  },
  watch: {
    transform: {
      handler() {
        if (this.$store.getters.svgElementDragging) {
          const br = this.bboxTransformed.br;
          this.foo1 = br[0];
          this.foo2 = br[1];
        }
      },
    },
  },
  methods: {
    dragSlider() {
      // get current slider position
      const slider_transform = svg_helpers.matrixTransformDictToArray(
        this.$refs.slider.transform.baseVal[0].matrix
      );
      const slider_center = [
        this.$refs.slider.cx.baseVal.value,
        this.$refs.slider.cy.baseVal.value,
      ];
      const slider_point = svg_helpers.matrixTransformPoint(
        slider_center,
        slider_transform
      );

      // get slider position in inverse (not transformed) space
      const slider_point_inverse = svg_helpers.matrixTransformPointInverse(
        slider_point,
        this.transform
      );

      // get the new bounding box
      const new_bbox = {
        x: this.element.bbox.x,
        y: this.element.bbox.y,
        width: slider_point_inverse[0] - this.element.bbox.x,
        height: slider_point_inverse[1] - this.element.bbox.y,
      };

      // transform old bounding box
      const bbox_xform = svg_helpers.matrixTransformNewBbox(
        this.element.bbox,
        new_bbox
      );
      const new_transform = svg_helpers.matrixTransformCompose(
        this.transform,
        bbox_xform
      );

      // update element transform
      const new_transform_str = svg_helpers.matrixTransformArrayToString(
        new_transform
      );
      this.$store.dispatch("svgElementUpdateTransform", {
        element_id: this.id,
        transform: new_transform_str,
      });
    },
  },
};
</script>


