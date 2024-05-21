<script lang="ts">
import * as Plot from "@observablehq/plot";
import { h, withDirectives } from "vue";
export default {
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
  render() {
    const { options } = this;
    return withDirectives(h("div"), [
      [
        {
          mounted(el) {
            el.append(Plot.plot(options));
          },
        },
      ],
    ]);
  },
};
</script>

<style scoped></style>
