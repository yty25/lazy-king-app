const path = require("path");

module.exports = {
  parser: require("postcss-comment"),
  plugins: [
    require("postcss-import")({
      resolve(id, basedir) {
        // 处理 @import 中的 ~@ 别名
        if (id.startsWith("~@/")) {
          return path.resolve(
            process.env.UNI_INPUT_DIR,
            "src",
            id.slice(3)
          );
        }
        if (id.startsWith("@/")) {
          return path.resolve(
            process.env.UNI_INPUT_DIR,
            "src",
            id.slice(2)
          );
        }
        return id;
      },
    }),
    require("@dcloudio/uni-postcss-plugin")(),
    require("autoprefixer")({
      remove: true,
    }),
  ],
};
