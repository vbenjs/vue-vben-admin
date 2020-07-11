/**
 build：The main purpose is to modify the submission of the project build system (such as the configuration of glup, webpack, rollup, etc.)
ci：The main purpose is to modify the project to continue the integration process (such as Travis, Jenkins, GitLab CI, Circle, etc.) submission
docs：update doc
merge：Merge branch ? of ?
update: Update a function
feat：new features
fix：bug fix
perf：Performance optimization
refactor：Refactored code (no new features or bug fixes)
style：Code modification that does not affect the program logic (modify blank characters, complete missing semicolons, etc.)
test：Add test cases or update existing tests
revert：Roll back an earlier commit
chore：Other types that are not of the above type
wip：Remove files or code
*/

module.exports = require('./config/lint/commit-lint');
