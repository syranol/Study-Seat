const gulp = require("gulp");
const tsProject = require("gulp-typescript").createProject("tsconfig.json");
const gulpSourcemap = require("gulp-sourcemaps");
const path = require("path");
const browserSync = require("browser-sync").create();
const spawn = require("child_process").spawn;
const dotenv = require("dotenv").config();

/**
 * watch client and server build directories for new compiled output, reload browser
 */
gulp.task("watch", () => {
    gulp.watch(["server/**/*.ts"], gulp.series("build:server", "browser:reload"));
    gulp.watch(["client/src/**/*"], gulp.series("build:client", "browser:reload"));
});

gulp.task("build:server", () => {
    return gulp.src("server/**/*.ts")
        .pipe(gulpSourcemap.init())
        .pipe(tsProject())
        .pipe(gulpSourcemap.write(".", { sourceRoot: "./", includeContent: false }))
        .pipe(gulp.dest("build/server"));
});

/**
 * build the React client
 */
gulp.task("build:client", (done) => {
    startWorker("npm", ["run", "build"], {
        cwd: path.join(__dirname, "./client/")
    }, done);
});

/**
 * auto reload browser
 */
gulp.task("browser:reload", (done) => {
    browserSync.reload();
    done();
});

/**
 * initialize browser-sync to auto-reload browser
 */
gulp.task("browser:init", (done) => {
    browserSync.init({
        proxy: `http://localhost:${process.env.LISTEN_PORT}`,
        // open: false,
        // watch: ["build", "client/build"]
    });
    done();
});

gulp.task("run:server", (done) => {
    startWorker("nodemon", [
        "--inspect", "build/server/index.js", "--watch", "build", "--ignore", "node_modules"
    ], {}, done);
});

gulp.task("build", gulp.parallel("build:client", "build:server"));

gulp.task("dev-helpers", gulp.parallel("run:server", "browser:init", "watch"));

gulp.task("default", gulp.series("build", "dev-helpers"));

/*******************************************************************************
 *                               Utilities                                     *
 *******************************************************************************/
/** spawn a worker process and pipe stdout */
const startWorker = (cmd, args, config, doneCallback) => {
    const worker = spawn(cmd, args, {
        stdio: "inherit",
        ...config
    });
    worker.on("data", (data) => {
        console.log(data.toString())
    });
    worker.on("error", (data) => {
        console.log(data.toString())
    });
    worker.on("exit", () => {
        doneCallback()
    });
}