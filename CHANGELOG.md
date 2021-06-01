## [2.4.1](https://github.com/anncwb/vue-vben-admin/compare/v2.4.0...v2.4.1) (2021-06-01)

### Bug Fixes

- **table:** make sure the table width is correct, fix [#593](https://github.com/anncwb/vue-vben-admin/issues/593) ([d73d43e](https://github.com/anncwb/vue-vben-admin/commit/d73d43ed91f30957cfd202c51552ca40a19cef08))
- Fix the problem that the `lang` attribute of `HTML` will not be set when it is first loaded ([#682](https://github.com/anncwb/vue-vben-admin/issues/682)) ([eca8907](https://github.com/anncwb/vue-vben-admin/commit/eca8907a11c28d816c3da5a0667f45a38a499012))
- **avatar:** mock data and Account center style ([2066f66](https://github.com/anncwb/vue-vben-admin/commit/2066f669715491f3e91ac6d0e905cd2b3e80b58d))
- **axios:** make sure that the parameter is an object before processing, fix [#660](https://github.com/anncwb/vue-vben-admin/issues/660) ([834fa7e](https://github.com/anncwb/vue-vben-admin/commit/834fa7eb9c8aff252e083d38fdab4f6f53b4d43a))
- **code-editor:** fix CodeEditor style problem, fix [#655](https://github.com/anncwb/vue-vben-admin/issues/655) ([5662804](https://github.com/anncwb/vue-vben-admin/commit/566280422de0537c4e31496eaaa95a9d51fe9458))
- **codeMirror:** fix the JsonEditor embedded in the bullet frame causing the style to be disordered ([#668](https://github.com/anncwb/vue-vben-admin/issues/668)) ([e1123a2](https://github.com/anncwb/vue-vben-admin/commit/e1123a2ccb5d5450a5072c19e5508a5dc0f14423))
- **form:** radioButtonGroup value support number ([bbddf30](https://github.com/anncwb/vue-vben-admin/commit/bbddf30e96feb1ab048323d93d3b8c1b18857acd))
- ensure that roleList is not empty ([aebad61](https://github.com/anncwb/vue-vben-admin/commit/aebad61b3d3e11aaf720b37e762e53e2e6999d3c))
- fix node12 version data mock error ([644dbe3](https://github.com/anncwb/vue-vben-admin/commit/644dbe315bb03ea1641a682359873237208a5303))
- **codeeditor:** empty value set failed.fixed:[#659](https://github.com/anncwb/vue-vben-admin/issues/659) ([ba2bebb](https://github.com/anncwb/vue-vben-admin/commit/ba2bebb4069085817a90d065ed5877fdb50a8039))
- **layout:** fix style compatibility issues ([905e5b7](https://github.com/anncwb/vue-vben-admin/commit/905e5b714b582548f32feca723012124343686a6))
- **login:** login page modal style fixed: [#662](https://github.com/anncwb/vue-vben-admin/issues/662) ([#666](https://github.com/anncwb/vue-vben-admin/issues/666)) ([b218f10](https://github.com/anncwb/vue-vben-admin/commit/b218f10e25a9364c399a5fe42eedb549f57c01ea))
- **table:** support change event ([9f4d171](https://github.com/anncwb/vue-vben-admin/commit/9f4d1719caa76de94e6362c16e4df3ac28df253c)), closes [#677](https://github.com/anncwb/vue-vben-admin/issues/677)
- **table:** useTable support onChange ([9f5085c](https://github.com/anncwb/vue-vben-admin/commit/9f5085c9f9f46b09391156b17091c1771bc13026))
- **table-action:** fix the split line style is missing,fix [#674](https://github.com/anncwb/vue-vben-admin/issues/674) ([b1cb863](https://github.com/anncwb/vue-vben-admin/commit/b1cb86350253dc5be095466966d9469775f4395d))
- login failed ([035f55a](https://github.com/anncwb/vue-vben-admin/commit/035f55af9778819d72adc1700d9de56a6569b58f))
- session timeout login logic error ([#678](https://github.com/anncwb/vue-vben-admin/issues/678)) ([132c7fb](https://github.com/anncwb/vue-vben-admin/commit/132c7fb944df255c4d76a25d6d924439f91f9c54)), closes [#673](https://github.com/anncwb/vue-vben-admin/issues/673)
- **layout:** fix class loss ([d018363](https://github.com/anncwb/vue-vben-admin/commit/d018363ddcd68189a18829a2b2560f3b98da58a6))
- **log:** fix Wrong version number ([#653](https://github.com/anncwb/vue-vben-admin/issues/653)) ([4f0d45f](https://github.com/anncwb/vue-vben-admin/commit/4f0d45f1df48755eadc0b09fa19762ee68f9abd1))
- **tree:** support defaultExpandAll prop ([3ed2339](https://github.com/anncwb/vue-vben-admin/commit/3ed2339a6d75abbd6ccf723b6eaa762f9921409e))
- theme switching fails ([7e2ca79](https://github.com/anncwb/vue-vben-admin/commit/7e2ca79ece2f5209cb7ce4b0f5ee15012f9f51de))

### Features

- **app-search:** auto focus on show ([1ae6362](https://github.com/anncwb/vue-vben-admin/commit/1ae636296df2cf99e8a777f053c539c50e6ad49a))
- **table:** add editable DatePicker & TimePicker ([#654](https://github.com/anncwb/vue-vben-admin/issues/654)) ([93006c7](https://github.com/anncwb/vue-vben-admin/commit/93006c7dc7b5243b26637f444c8057c95935e622))
- **table:** editable component text align ([8eaf575](https://github.com/anncwb/vue-vben-admin/commit/8eaf57562610a833c8083ae9957f458319d1cc93))
- **tabs:** add setTabTitle method ([#680](https://github.com/anncwb/vue-vben-admin/issues/680)) ([5ddccf6](https://github.com/anncwb/vue-vben-admin/commit/5ddccf6ba28453b9a35355d53d0db65f1a8876bc))
- **tinymce:** support dark theme and I18n ([83c9cd7](https://github.com/anncwb/vue-vben-admin/commit/83c9cd77421e9c0888a41e2d8dcbca816da67488))
- **tree:** add defaultExpandLevel prop ([6edca1c](https://github.com/anncwb/vue-vben-admin/commit/6edca1c19c3b0772f9ab82a7b09251a74fff2173)), closes [#672](https://github.com/anncwb/vue-vben-admin/issues/672)

### Performance Improvements

- **i18n:** improve warning prompt ([6ef62ba](https://github.com/anncwb/vue-vben-admin/commit/6ef62ba6ea7f5613a1fec982b30fe6b0f478bf59))

# [2.4.0](https://github.com/anncwb/vue-vben-admin/compare/v2.2.0...v2.4.0) (2021-05-25)

### Bug Fixes

- **api-select:** make sure the type is correct, fix [#468](https://github.com/anncwb/vue-vben-admin/issues/468) ([37c5741](https://github.com/anncwb/vue-vben-admin/commit/37c5741601951349f622801a48a7bf9e45d723a4))
- **avatar:** show current user's avatar ([#640](https://github.com/anncwb/vue-vben-admin/issues/640)) ([7519a00](https://github.com/anncwb/vue-vben-admin/commit/7519a00ada89966f9caf93d315830dd628253d73))
- **button:** ghost style ([f4af231](https://github.com/anncwb/vue-vben-admin/commit/f4af231172874eeffa9097e2624c4a7d0654f7d7))
- **cipher:** fix [#587](https://github.com/anncwb/vue-vben-admin/issues/587) ([#588](https://github.com/anncwb/vue-vben-admin/issues/588)) ([d34467d](https://github.com/anncwb/vue-vben-admin/commit/d34467d3f4d0f709a99194e36c0e0b6f242d9b40))
- **CodeEditor:** add readonly prop ([#572](https://github.com/anncwb/vue-vben-admin/issues/572)) ([9cd293c](https://github.com/anncwb/vue-vben-admin/commit/9cd293c283ede7391ccd36e2208ae68cbad66453))
- **flow-chart:** dark style not work ([4a03547](https://github.com/anncwb/vue-vben-admin/commit/4a035478ca0e08098a4575a5b22c06580ffeecbe))
- **form:** ensure that the DateTime component checked properly,fix [#511](https://github.com/anncwb/vue-vben-admin/issues/511) ([cb35341](https://github.com/anncwb/vue-vben-admin/commit/cb35341b8fd44eb649a79c3a2ae799c7bab8c4f6))
- **form:** expose formModel,fix [#533](https://github.com/anncwb/vue-vben-admin/issues/533) ([7c41c86](https://github.com/anncwb/vue-vben-admin/commit/7c41c8673c2fd5f2cf946a3ae84d8688578f9754))
- **form:** Improve form error handling ([9a21b8b](https://github.com/anncwb/vue-vben-admin/commit/9a21b8b6a4a33d69c4e1b439fc01c4038c150ff9))
- **form:** improve form props acquisition,fix [#527](https://github.com/anncwb/vue-vben-admin/issues/527) ([b7ea68e](https://github.com/anncwb/vue-vben-admin/commit/b7ea68e6f8944b154edf1fccd3faf8744883cbd4))
- **form:** improve warning prompt, fix [#538](https://github.com/anncwb/vue-vben-admin/issues/538) ([3ff70bb](https://github.com/anncwb/vue-vben-admin/commit/3ff70bb56f998cfc92a773676d75c06372d90658))
- **form:** placeholder setting in componentProps ([#634](https://github.com/anncwb/vue-vben-admin/issues/634)) ([2d3d04f](https://github.com/anncwb/vue-vben-admin/commit/2d3d04f547046c23cdfc319a7483261b47c08e83))
- **form:** remove field binding when deleting schema [#471](https://github.com/anncwb/vue-vben-admin/issues/471) ([38f5072](https://github.com/anncwb/vue-vben-admin/commit/38f5072695f63b30c6ce6b2741b003db605abd82))
- **layout:** fix useLockPage not work, fix [#611](https://github.com/anncwb/vue-vben-admin/issues/611) ([3bb6d11](https://github.com/anncwb/vue-vben-admin/commit/3bb6d11ed1b33adbfd6c76a0e06442cd62356ab7))
- **lock:** automatic screen lock does not work ([d5b7689](https://github.com/anncwb/vue-vben-admin/commit/d5b768929e02ac4c6a04f3fd17a904e894c50e36))
- **login:** incorrect enter event bind ([#625](https://github.com/anncwb/vue-vben-admin/issues/625)) ([bb0d2e1](https://github.com/anncwb/vue-vben-admin/commit/bb0d2e1c71899937f3c3d467803b18013e91782a))
- **menu:** ensure that the external link jumps correctly, fix [#516](https://github.com/anncwb/vue-vben-admin/issues/516) ([6b7f688](https://github.com/anncwb/vue-vben-admin/commit/6b7f688eaf08184272fc625ca7e7665384641714))
- **menu:** improve menu logic, fix [#461](https://github.com/anncwb/vue-vben-admin/issues/461) ([ee1c349](https://github.com/anncwb/vue-vben-admin/commit/ee1c3498587951a6a4cc0b49edb9dacf3f2af5c3))
- **modal:** proptype conflict with ant design modal(fixed: [#545](https://github.com/anncwb/vue-vben-admin/issues/545)) ([#575](https://github.com/anncwb/vue-vben-admin/issues/575)) ([a579b84](https://github.com/anncwb/vue-vben-admin/commit/a579b8456ac73ac48c6af1510317acca20ed9b52))
- **store:** addTab fx ([#607](https://github.com/anncwb/vue-vben-admin/issues/607)) ([336be68](https://github.com/anncwb/vue-vben-admin/commit/336be680d307acf8a1710194eba5505f8532d0bb))
- **store:** fix pinia typo ([bbf178f](https://github.com/anncwb/vue-vben-admin/commit/bbf178f64b29d4576ba7de8afdce37d677f748e8))
- **style:** add table title min-height ([#547](https://github.com/anncwb/vue-vben-admin/issues/547)) ([bf365e2](https://github.com/anncwb/vue-vben-admin/commit/bf365e26e5d457ca1924def3e50097e1d211aa43))
- **style:** fix icon style, fix [#496](https://github.com/anncwb/vue-vben-admin/issues/496) ([ccae5cd](https://github.com/anncwb/vue-vben-admin/commit/ccae5cd9246888709a319f92357d89c6ab9d9c0b))
- **style:** fix layout style, fix [#633](https://github.com/anncwb/vue-vben-admin/issues/633) ([8e3f84c](https://github.com/anncwb/vue-vben-admin/commit/8e3f84c3b76fbca11222cbede2441e83154127b6))
- **theme:** make sure the menu style is correct, fix [#382](https://github.com/anncwb/vue-vben-admin/issues/382) ([c77f7e6](https://github.com/anncwb/vue-vben-admin/commit/c77f7e62aba51072325dffdb01d3c0cc87c578b0))
- **theme:** make sure the steps style is correct, fix [#414](https://github.com/anncwb/vue-vben-admin/issues/414) ([640a2c1](https://github.com/anncwb/vue-vben-admin/commit/640a2c17986e2b59be57125e91051ec879f31eeb))
- **types:** fix store types ([cd4b5e1](https://github.com/anncwb/vue-vben-admin/commit/cd4b5e14c2afe8841871cf79490a02a30bed0ebe))
- typo, ifx [#637](https://github.com/anncwb/vue-vben-admin/issues/637) ([e3569b8](https://github.com/anncwb/vue-vben-admin/commit/e3569b81b10e887ed7144349181904ea6fdef14d))
- **style:** fix build style errors,fix [#528](https://github.com/anncwb/vue-vben-admin/issues/528) ([7f6f8ee](https://github.com/anncwb/vue-vben-admin/commit/7f6f8eefe9b1214d5c6dabc526d966dfcaea76e6))
- **style:** fix layout header style, basic arrow style and table search form style ([#525](https://github.com/anncwb/vue-vben-admin/issues/525)) ([e2ddf43](https://github.com/anncwb/vue-vben-admin/commit/e2ddf43699df900dacab7d7d384d7caa53879ad9))
- **table:** columns ref fixed([#564](https://github.com/anncwb/vue-vben-admin/issues/564)) ([#573](https://github.com/anncwb/vue-vben-admin/issues/573)) ([43e4c21](https://github.com/anncwb/vue-vben-admin/commit/43e4c21950ea3659c538ecc29b04b0377a6de874))
- **table:** submitButtonOptions not work,fix [#531](https://github.com/anncwb/vue-vben-admin/issues/531) ([16ecf71](https://github.com/anncwb/vue-vben-admin/commit/16ecf71850675be0031f41c8cb91371cf07cbea0))
- **tabs:** fix the problem that other functions are invalid when the tab is closed, close [#376](https://github.com/anncwb/vue-vben-admin/issues/376) ([b92b8a3](https://github.com/anncwb/vue-vben-admin/commit/b92b8a3c6af1d936d48b5f58674f419407eeb600))
- **theme:** wrong color when RadioButtonGroup checked ([#626](https://github.com/anncwb/vue-vben-admin/issues/626)) ([5eee0ce](https://github.com/anncwb/vue-vben-admin/commit/5eee0ceb6e1e949e63d51cd0d9647cf8094f378c))
- **theme generate:** Fix [#604](https://github.com/anncwb/vue-vben-admin/issues/604) ([#605](https://github.com/anncwb/vue-vben-admin/issues/605)) ([c26dd03](https://github.com/anncwb/vue-vben-admin/commit/c26dd034165b02d107977fdfe13471ea80e991cc))
- **tinymce:** ensure that the public resource path is correct,fix [#487](https://github.com/anncwb/vue-vben-admin/issues/487) ([a863ad4](https://github.com/anncwb/vue-vben-admin/commit/a863ad46b4e2837cbbda8bb51b8c9a6e8bb3f442))
- **tree:** basicTree 设置 blockNode=false 后，显示异常 ([#567](https://github.com/anncwb/vue-vben-admin/issues/567)) ([2f8b218](https://github.com/anncwb/vue-vben-admin/commit/2f8b2183ec25f7c2a11bb5dc0a0a2578d7568ec3))
- **tree:** onCheck event lose origin param ([#636](https://github.com/anncwb/vue-vben-admin/issues/636)) ([d8ff30d](https://github.com/anncwb/vue-vben-admin/commit/d8ff30d9ece53e006e5e58894461adeeb3b273e0))
- **tree:** typo([#615](https://github.com/anncwb/vue-vben-admin/issues/615)) ([bc82d1a](https://github.com/anncwb/vue-vben-admin/commit/bc82d1a397beff68ba86365d7d54bb70b3520f9f))
- **tree:** value prop type ([#613](https://github.com/anncwb/vue-vben-admin/issues/613)) ([0112d6b](https://github.com/anncwb/vue-vben-admin/commit/0112d6b313e66f624cd91e9ef933af57b0d280f9))
- echart import path ([7e43d88](https://github.com/anncwb/vue-vben-admin/commit/7e43d88f9c37d88d7bf1b2d29e8ffbdc7ca155a5))
- ensure that the 401 jumps to the login page correctly, fix [#512](https://github.com/anncwb/vue-vben-admin/issues/512) ([6a88205](https://github.com/anncwb/vue-vben-admin/commit/6a8820597fb58ef7cda7ead59f5cbb4c72c0f882))
- fix AppendFormDemo ([#505](https://github.com/anncwb/vue-vben-admin/issues/505)) ([8c2491f](https://github.com/anncwb/vue-vben-admin/commit/8c2491fcb6853bfe06df265eb6daa5aa7d979b74))
- fix case errors ([663d13a](https://github.com/anncwb/vue-vben-admin/commit/663d13a67f84fb02a6b9ee44a6e8b53c32cc6044))
- fix dark theme refreshing flashing white screen ([26adbc9](https://github.com/anncwb/vue-vben-admin/commit/26adbc92be1c8ce5ce6f93302fb806058ef087cf))
- fix the default value of props ([8b2e0f6](https://github.com/anncwb/vue-vben-admin/commit/8b2e0f665f15edd211f558bc0526465e07e7bab0))
- improve login page style ([780a8a6](https://github.com/anncwb/vue-vben-admin/commit/780a8a67b874ca1c8d05c2561f88081cc4ec4b28))
- Improve the picture cropping component ([#463](https://github.com/anncwb/vue-vben-admin/issues/463)) ([700306b](https://github.com/anncwb/vue-vben-admin/commit/700306bb45d5f2b975c20bd2581fb87a210e589c))
- login page overflow show problem ([#455](https://github.com/anncwb/vue-vben-admin/issues/455)) ([af6d58e](https://github.com/anncwb/vue-vben-admin/commit/af6d58eb26875f02afb419d9d4d5ee2454292863))
- password icon dislocation ([#501](https://github.com/anncwb/vue-vben-admin/issues/501)) ([bd83ecc](https://github.com/anncwb/vue-vben-admin/commit/bd83eccdc55c697d0db83bc3a7cf2829cafe96e7))
- trigger resize in full screen to ensure that the height of other components is normal,fix [#508](https://github.com/anncwb/vue-vben-admin/issues/508) ([ca71760](https://github.com/anncwb/vue-vben-admin/commit/ca717602a602ae90e5c175cdfda0bbcc200b72ad))
- update Axios.ts ([#492](https://github.com/anncwb/vue-vben-admin/issues/492)) ([e1b30a5](https://github.com/anncwb/vue-vben-admin/commit/e1b30a5075a2a2f9e2c538350950e6e09b6decd1))

### Features

- **axios:** Do you want to return the original response header? For example, use this property when you need to get the response header ([56d8af1](https://github.com/anncwb/vue-vben-admin/commit/56d8af147ec88bb98a37fa3ddf47c2aa16a4110e))
- **demo:** add permission table demo ([9e20841](https://github.com/anncwb/vue-vben-admin/commit/9e208411a24d4ccc9306555cc45aa7135d0df78f))
- **form:** add 'layout', 'labelAlign', 'rowProps' option ([#651](https://github.com/anncwb/vue-vben-admin/issues/651)) ([785732f](https://github.com/anncwb/vue-vben-admin/commit/785732f438916d7767ad44789c16216a6f6505a8))
- **form:** add form field nested support ([#591](https://github.com/anncwb/vue-vben-admin/issues/591)) ([ec3d51d](https://github.com/anncwb/vue-vben-admin/commit/ec3d51d69b66500f4f604151255920460d1906ce))
- **form:** add prop autoSubmitOnEnter ([#620](https://github.com/anncwb/vue-vben-admin/issues/620)) ([9b2d41e](https://github.com/anncwb/vue-vben-admin/commit/9b2d41ea44ed0da4dde22856bf23b52748244642))
- **form:** add Slider demo ([#555](https://github.com/anncwb/vue-vben-admin/issues/555)) ([e80280f](https://github.com/anncwb/vue-vben-admin/commit/e80280fb81b0bcdd74066c08fd4403e36b00b026))
- **form:** adding resetSchema method ([c639e49](https://github.com/anncwb/vue-vben-admin/commit/c639e493a5a32789e397990953189541170169c8))
- **form:** helpMessage Increase function type value ([#616](https://github.com/anncwb/vue-vben-admin/issues/616)) ([f455fb9](https://github.com/anncwb/vue-vben-admin/commit/f455fb97f9b70ca4979561a82ae0f25825527013))
- **form:** requires Increase function type value ([#649](https://github.com/anncwb/vue-vben-admin/issues/649)) ([765064a](https://github.com/anncwb/vue-vben-admin/commit/765064a190b1a24dfb9ae808e99807ddae2ed212))
- **qrcode:** custom drawing support ([#580](https://github.com/anncwb/vue-vben-admin/issues/580)) ([2b76b88](https://github.com/anncwb/vue-vben-admin/commit/2b76b88481dab2c580e684987a80028710d4698d))
- **table:** 表格的数据列和操作列的字段可以根据权限和业务来控制是否显示 ([5a3861b](https://github.com/anncwb/vue-vben-admin/commit/5a3861b9cfc79da3297f8ddd045b88f0daca0ada))
- **table:** Table operation columns support permission codes ([6afee41](https://github.com/anncwb/vue-vben-admin/commit/6afee415a3a8007f13af57892d62759ffbcde5a5))
- **user:** add user login expiration example ([5465f05](https://github.com/anncwb/vue-vben-admin/commit/5465f058ceb7b130e456feaebb17c3beedb092a5))
- add codeEditor component ([a812685](https://github.com/anncwb/vue-vben-admin/commit/a812685084b45ce3c6b6675bb1569e324f742416))
- add flowChart Component ([#488](https://github.com/anncwb/vue-vben-admin/issues/488)) ([2576735](https://github.com/anncwb/vue-vben-admin/commit/2576735adeb42ddd39bbaae6f4f5662df781b83a))
- add JsonPreview component ([0649011](https://github.com/anncwb/vue-vben-admin/commit/0649011eba9b86b543223aca99721da754dcea14))
- add spin prop for Icon ([#477](https://github.com/anncwb/vue-vben-admin/issues/477)) ([6dd7d0f](https://github.com/anncwb/vue-vben-admin/commit/6dd7d0f928ebb4c6d7be66f4cd134fb291fc7dc2))
- persistent save tab, fix [#359](https://github.com/anncwb/vue-vben-admin/issues/359) ([967b28c](https://github.com/anncwb/vue-vben-admin/commit/967b28c4c06cf92e9ab90cff51f59a0d6ced5d7b))

### Performance Improvements

- let svg-icon support ssr ([94a826d](https://github.com/anncwb/vue-vben-admin/commit/94a826d02858e115adf8c1db4c0d0d7d795d7281))
- **tree:** improve the beforeRightClick callback to support more configuration of the menu ([#608](https://github.com/anncwb/vue-vben-admin/issues/608)) ([adff788](https://github.com/anncwb/vue-vben-admin/commit/adff788de54a46fd035b569892135be377dd4f92))
- add AppendFormDemo ([#503](https://github.com/anncwb/vue-vben-admin/issues/503)) ([85b92a9](https://github.com/anncwb/vue-vben-admin/commit/85b92a9add2b560559b4ef60ecf93e22f5941edb))
- add Coordinating the selection of provinces and cities ([#534](https://github.com/anncwb/vue-vben-admin/issues/534)) ([5fae2b0](https://github.com/anncwb/vue-vben-admin/commit/5fae2b02eae7dc91baef774ca9dfdf0da91b8040))
- improve countTo ([#499](https://github.com/anncwb/vue-vben-admin/issues/499)) ([94b2222](https://github.com/anncwb/vue-vben-admin/commit/94b2222c085e30cbc4a7a49dfac13af15aec98b9))
- improve cropper example ([#491](https://github.com/anncwb/vue-vben-admin/issues/491)) ([5e36a8b](https://github.com/anncwb/vue-vben-admin/commit/5e36a8b5754afe916236f1c58a159aa7df69cf83))
- improve flowChart logic ([e1bc33f](https://github.com/anncwb/vue-vben-admin/commit/e1bc33f5c5660f62591997c1949c887ac7387871))
- merge locale file ([c04e894](https://github.com/anncwb/vue-vben-admin/commit/c04e8943bcdcdee612044a534d6c1281c956c3c1))
- optimize i18n to add the initial locale to the locale pool during initialization ([#577](https://github.com/anncwb/vue-vben-admin/issues/577)) ([ae3f832](https://github.com/anncwb/vue-vben-admin/commit/ae3f8329c25ef24c44c54690116fd7d3dc35ae85))
- set header can use For Qs ([#562](https://github.com/anncwb/vue-vben-admin/issues/562)) ([5724bc5](https://github.com/anncwb/vue-vben-admin/commit/5724bc5b3b960f7c0686c8e60c2b682b16841e6f))

# [2.3.0](https://github.com/anncwb/vue-vben-admin/compare/v2.2.0...v2.3.0) (2021-04-10)

### Bug Fixes

- **api-select:** make sure the type is correct, fix [#468](https://github.com/anncwb/vue-vben-admin/issues/468) ([37c5741](https://github.com/anncwb/vue-vben-admin/commit/37c5741601951349f622801a48a7bf9e45d723a4))
- **menu:** improve menu logic, fix [#461](https://github.com/anncwb/vue-vben-admin/issues/461) ([ee1c349](https://github.com/anncwb/vue-vben-admin/commit/ee1c3498587951a6a4cc0b49edb9dacf3f2af5c3))
- **theme:** make sure the menu style is correct, fix [#382](https://github.com/anncwb/vue-vben-admin/issues/382) ([c77f7e6](https://github.com/anncwb/vue-vben-admin/commit/c77f7e62aba51072325dffdb01d3c0cc87c578b0))
- **theme:** make sure the steps style is correct, fix [#414](https://github.com/anncwb/vue-vben-admin/issues/414) ([640a2c1](https://github.com/anncwb/vue-vben-admin/commit/640a2c17986e2b59be57125e91051ec879f31eeb))
- improve login page style ([780a8a6](https://github.com/anncwb/vue-vben-admin/commit/780a8a67b874ca1c8d05c2561f88081cc4ec4b28))
- Improve the picture cropping component ([#463](https://github.com/anncwb/vue-vben-admin/issues/463)) ([700306b](https://github.com/anncwb/vue-vben-admin/commit/700306bb45d5f2b975c20bd2581fb87a210e589c))
- login page overflow show problem ([#455](https://github.com/anncwb/vue-vben-admin/issues/455)) ([af6d58e](https://github.com/anncwb/vue-vben-admin/commit/af6d58eb26875f02afb419d9d4d5ee2454292863))

### Features

- persistent save tab, fix [#359](https://github.com/anncwb/vue-vben-admin/issues/359) ([967b28c](https://github.com/anncwb/vue-vben-admin/commit/967b28c4c06cf92e9ab90cff51f59a0d6ced5d7b))

# [2.2.0](https://github.com/anncwb/vue-vben-admin/compare/v2.1.1...v2.2.0) (2021-04-07)

### Bug Fixes

- **abakysis:** fix tooltip style,fix [#436](https://github.com/anncwb/vue-vben-admin/issues/436) ([1e4a250](https://github.com/anncwb/vue-vben-admin/commit/1e4a250da10b01bfd4e667d533f6cae9b8c58fe9))
- **breadcrumb:** ensure the breadcrumbs display the icon correctly, fix [#433](https://github.com/anncwb/vue-vben-admin/issues/433) ([0b66360](https://github.com/anncwb/vue-vben-admin/commit/0b66360cc9f60c5064be4c3cae39091541f3be8c))
- **build:** fix build error ([6d6e0a1](https://github.com/anncwb/vue-vben-admin/commit/6d6e0a1bfef3a152d31776520e1445203d2ba3f4))
- **drawer:** ensure the slot is working ([b9b470f](https://github.com/anncwb/vue-vben-admin/commit/b9b470f4df1cd57ca501666b6b3270a4d4d4f873))
- **echart:** legend not work ([b25ceb4](https://github.com/anncwb/vue-vben-admin/commit/b25ceb4201bce806dc129f24c2d98fd2ff0392d1))
- **menu:** ensure the menu is activated correctly,fix [#432](https://github.com/anncwb/vue-vben-admin/issues/432) ([bb67692](https://github.com/anncwb/vue-vben-admin/commit/bb67692cfdd5089f0f1d60d4a36b52592db22dde))
- **mock:** make sure the background mode login is normal, fix [#452](https://github.com/anncwb/vue-vben-admin/issues/452) ([1e66987](https://github.com/anncwb/vue-vben-admin/commit/1e669870cc15384bf76f32ee95008f0c998b477b))
- **server:** grammatical errors ([ee4829c](https://github.com/anncwb/vue-vben-admin/commit/ee4829c15d7c8e978eb616edb7f1e61c258d469b))
- **table:** ensure data responsiveness, fix [#447](https://github.com/anncwb/vue-vben-admin/issues/447) ([64b6313](https://github.com/anncwb/vue-vben-admin/commit/64b6313b4e43fdc2e9b292f554889b845e26182f))
- **table:** make sure the editing line is working, fix [#439](https://github.com/anncwb/vue-vben-admin/issues/439) ([b54b794](https://github.com/anncwb/vue-vben-admin/commit/b54b794264ecb513567b841c5a12856965d02754))
- **table-action:** ensure that the click event is not triggered, fix [#441](https://github.com/anncwb/vue-vben-admin/issues/441) ([67a7a76](https://github.com/anncwb/vue-vben-admin/commit/67a7a76b735aafe2e1a8258c75c4a3c5dd657de6))
- **use-loading:** rendering fails when used with onMounted, fix [#438](https://github.com/anncwb/vue-vben-admin/issues/438) ([6b99622](https://github.com/anncwb/vue-vben-admin/commit/6b996229e1449b1721ce6797ba6a964850e2e215))
- **useColumn:** fixed table column changes with hidden columns disappearing after dropping ([#453](https://github.com/anncwb/vue-vben-admin/issues/453)) ([f05cc6d](https://github.com/anncwb/vue-vben-admin/commit/f05cc6d34e935c342e1f7ada6692ea0178b7c984))

### Features

- dark mode ([5b8eb4a](https://github.com/anncwb/vue-vben-admin/commit/5b8eb4a49a097a47caf491c44df427522ab58daa))
- **api-select:** add immediate option,close [#430](https://github.com/anncwb/vue-vben-admin/issues/430) ([5b4a41c](https://github.com/anncwb/vue-vben-admin/commit/5b4a41ced412fe3623618791ffa3123a3a2cfcdc))
- **print:** add print example ([2f99892](https://github.com/anncwb/vue-vben-admin/commit/2f99892d96770d550e1cf58e052c40b85efb53c2))
- **tree:** add headerTitle slot ([6bb19fb](https://github.com/anncwb/vue-vben-admin/commit/6bb19fb2d4fa57d8006281d52acd80baaa054b3e))

### Performance Improvements

- code optimization ([37f6660](https://github.com/anncwb/vue-vben-admin/commit/37f6660c574f0cf8b432f66b67062c3bb0314d5c))
- delete tinymce useless style files ([edc7525](https://github.com/anncwb/vue-vben-admin/commit/edc7525103f2e0fd90562b2e30839c11ed62556d))
- refoctor useTitle ([979058a](https://github.com/anncwb/vue-vben-admin/commit/979058ad95d9669cb113033f76b5dafb932aad0f))

## [2.1.1](https://github.com/anncwb/vue-vben-admin/compare/v2.1.0...v2.1.1) (2021-03-25)

### Bug Fixes

- **form:** ensure that the hidden fields of the form are verified properly, fix [#413](https://github.com/anncwb/vue-vben-admin/issues/413) ([237f41d](https://github.com/anncwb/vue-vben-admin/commit/237f41da68592ede236b722157c91f9d7b45db1b))
- **icon:** ensure the menu icon style is correct, fix [#425](https://github.com/anncwb/vue-vben-admin/issues/425) ([5c57a1d](https://github.com/anncwb/vue-vben-admin/commit/5c57a1dda13975c13e65511a39e7483e4a5d3999))
- add route base close [#404](https://github.com/anncwb/vue-vben-admin/issues/404) ([8ad127c](https://github.com/anncwb/vue-vben-admin/commit/8ad127c293872aa10db03044bbc68715dc1b804a))
- ensure permissionMode exists close [#409](https://github.com/anncwb/vue-vben-admin/issues/409) ([8fb0396](https://github.com/anncwb/vue-vben-admin/commit/8fb03961f50051695983f8cb415d6009b9d6b643))
- refresh error ([5bf90ee](https://github.com/anncwb/vue-vben-admin/commit/5bf90eea627638517e3ced024289696a6ece8e74))
- **input-count:** make sure the reset function works close [#381](https://github.com/anncwb/vue-vben-admin/issues/381) ([3c4de9b](https://github.com/anncwb/vue-vben-admin/commit/3c4de9b0be06350f0d9ad97bfb5f7f773c38be38))
- **menu:** ensure the menu has meta attributes close [#397](https://github.com/anncwb/vue-vben-admin/issues/397) ([b2a1951](https://github.com/anncwb/vue-vben-admin/commit/b2a1951fd00433cb5e1c9dce982c53a9c9edd874))
- **menu:** fix the menu disappeared in background mode ([50915c9](https://github.com/anncwb/vue-vben-admin/commit/50915c9754473ba9096b3b1cceedf0d7e7212ad9))
- **menu:** make sure the menu is displayed properly on the small screen close [#336](https://github.com/anncwb/vue-vben-admin/issues/336) ([82c3186](https://github.com/anncwb/vue-vben-admin/commit/82c3186309971517183fc44bfcac159612e48a7b))
- **progress:** fix progress sometimes cannot done ([#388](https://github.com/anncwb/vue-vben-admin/issues/388)) ([8360b1d](https://github.com/anncwb/vue-vben-admin/commit/8360b1d6886b5639cf43da5ab866156d140a0f01))
- **route:** ensure that the first level menu can be hidden ([e2cc5af](https://github.com/anncwb/vue-vben-admin/commit/e2cc5af9375f59d2891be769010ef5d3ccfe9755))
- **table:** ensure that the height calculation is correct close [#395](https://github.com/anncwb/vue-vben-admin/issues/395) ([1d7608e](https://github.com/anncwb/vue-vben-admin/commit/1d7608ee40c27ce81e031947ed6c679cc8b04c77))
- **table:** fix table check column configuration failure close [#391](https://github.com/anncwb/vue-vben-admin/issues/391) ([c3096e2](https://github.com/anncwb/vue-vben-admin/commit/c3096e26ff24c8afd9555e676c898030664846d7))
- **tree:** ensure that the check event is emitted close [#400](https://github.com/anncwb/vue-vben-admin/issues/400) ([16ef134](https://github.com/anncwb/vue-vben-admin/commit/16ef13477c8f06c13ff3611b9e67e430fac433e7))
- ensure the breadcrumb level is correct ([e49072c](https://github.com/anncwb/vue-vben-admin/commit/e49072c31339ba58473ffa883308cc3c2c4c43e9))
- LayoutMap cannot get correctly ([#398](https://github.com/anncwb/vue-vben-admin/issues/398)) ([7c16c2f](https://github.com/anncwb/vue-vben-admin/commit/7c16c2fa9e6cb2e87894666d6687eed3fc744b64))
- welcome page not cached in back-end mode ([#389](https://github.com/anncwb/vue-vben-admin/issues/389)) ([f0b93b5](https://github.com/anncwb/vue-vben-admin/commit/f0b93b50e7b6b9c444f8422f91be73085be8c5fe))
- **v-auth:** ensure the background mode is correct close [#330](https://github.com/anncwb/vue-vben-admin/issues/330) ([67962f1](https://github.com/anncwb/vue-vben-admin/commit/67962f1deea31d695d20ae0ea7fc39b39c1eea47))

### Features

- **route:** add hideChildrenInMenu option close [#346](https://github.com/anncwb/vue-vben-admin/issues/346) ([b67cf22](https://github.com/anncwb/vue-vben-admin/commit/b67cf22dfc8d27428b045f47fcd9e2797b81a81d))
- **table:** add expandAll/collapseAll function close [#333](https://github.com/anncwb/vue-vben-admin/issues/333) ([391da9e](https://github.com/anncwb/vue-vben-admin/commit/391da9ec2884885f9dfe86ddb869ccc0d193491e))

# [2.1.0](https://github.com/anncwb/vue-vben-admin/compare/v2.0.3...v2.1.0) (2021-03-15)

### Bug Fixes

- **button:** fix button style error close [#312](https://github.com/anncwb/vue-vben-admin/issues/312) ([7a6c87f](https://github.com/anncwb/vue-vben-admin/commit/7a6c87f8c1aa34a7a00506fb89fb231e3a176f6f))
- **menu:** fix hideMenu not working close [#338](https://github.com/anncwb/vue-vben-admin/issues/338) ([5b2fbfb](https://github.com/anncwb/vue-vben-admin/commit/5b2fbfb6ce4054ece60c851c45baf60f3a07a4db))
- **page-wraper:** fix PageWrapper the scroll bar on the right side of the content area when the user clicks on the tab page to reload the page ([#341](https://github.com/anncwb/vue-vben-admin/issues/341)) ([fcff2cb](https://github.com/anncwb/vue-vben-admin/commit/fcff2cb1911f1e18017f25b3509d1c67f7e86e81))
- **page-wrapper:** fix PageWrapper title not showing ([9e3adaa](https://github.com/anncwb/vue-vben-admin/commit/9e3adaa30c7cdaf23855922100e16717856ba1d9))
- **table:** ensure that editable cell values are echoed correctly close [#335](https://github.com/anncwb/vue-vben-admin/issues/335) ([fab7a6c](https://github.com/anncwb/vue-vben-admin/commit/fab7a6c58d586300d58e1b6837927e1569b57aa5))
- **table:** ensure that the height calculation is normal close [#349](https://github.com/anncwb/vue-vben-admin/issues/349) ([6095cb5](https://github.com/anncwb/vue-vben-admin/commit/6095cb54afe3f4fcabbfff26ac6704ecfbbddae5))
- **table:** ensure that the table height is correct when the data is empty ([53867a8](https://github.com/anncwb/vue-vben-admin/commit/53867a846154d9a3529f50d20d92ce5fdb41986f))
- **table:** ensure that the value of the table action is updated correctly close [#301](https://github.com/anncwb/vue-vben-admin/issues/301) [#313](https://github.com/anncwb/vue-vben-admin/issues/313) ([7156e47](https://github.com/anncwb/vue-vben-admin/commit/7156e47c1813ec01594d9dff4a1e7d593f3c17db))
- **table:** fix table height calculation problem ([0fe42a0](https://github.com/anncwb/vue-vben-admin/commit/0fe42a06c1f2ef69805dbfeecbcac919ff0aedd0)), closes [#348](https://github.com/anncwb/vue-vben-admin/issues/348)
- **table:** fix table row misalignment close [#353](https://github.com/anncwb/vue-vben-admin/issues/353) ([e15737b](https://github.com/anncwb/vue-vben-admin/commit/e15737b9d17d8ebea4f4e9897aeae9b250910a15))
- **table:** fix TableAction row height error close [#350](https://github.com/anncwb/vue-vben-admin/issues/350) ([a759e44](https://github.com/anncwb/vue-vben-admin/commit/a759e44c6e5c223d2fef52c5a9698e571eed2d52))
- **transition:** fix transition not work close [#334](https://github.com/anncwb/vue-vben-admin/issues/334) ([7d8b8db](https://github.com/anncwb/vue-vben-admin/commit/7d8b8db256f78b228b2b4629a472834a4cce9bd4))
- **tree:** ebsure the expansion is functioning properly close [#362](https://github.com/anncwb/vue-vben-admin/issues/362) ([a405de8](https://github.com/anncwb/vue-vben-admin/commit/a405de8d202710264e802edb270bbd5cd4a1ab80))
- **tree:** tree can customize title close [#344](https://github.com/anncwb/vue-vben-admin/issues/344) ([ed422b7](https://github.com/anncwb/vue-vben-admin/commit/ed422b7c56bf9d44be001b8a54358d69c100ff35))
- **useTableScroll:** query paginationel every time to get the correct height ([#355](https://github.com/anncwb/vue-vben-admin/issues/355)) ([f818bb9](https://github.com/anncwb/vue-vben-admin/commit/f818bb9a107e43adfb8ef2a095635f5fffb5800b))

### Features

- **icon:** added svg icon picker ([1418dc6](https://github.com/anncwb/vue-vben-admin/commit/1418dc6a597a8410711359f07ae66f0fea858977))
- **map:** added AMap/Baidu/Google Map example close [#81](https://github.com/anncwb/vue-vben-admin/issues/81) ([a9462f0](https://github.com/anncwb/vue-vben-admin/commit/a9462f0d4dacb8db9300c416b2d3f094be624220))
- **time:** added time compoennt close [#285](https://github.com/anncwb/vue-vben-admin/issues/285) ([a89eeef](https://github.com/anncwb/vue-vben-admin/commit/a89eeef6f3a0b9863d28cf516b126a938eed7361))

### Performance Improvements

- **icon:** icon and SvgIcon integration ([e8fe6a9](https://github.com/anncwb/vue-vben-admin/commit/e8fe6a929be025a889ddec624ff9c2729313c818))

## [2.0.3](https://github.com/anncwb/vue-vben-admin/compare/v2.0.2...v2.0.3) (2021-03-07)

### Bug Fixes

- **breadcrumb:** ensure that the single-level breadcrumbs jump correctly close [#321](https://github.com/anncwb/vue-vben-admin/issues/321) ([e0dc5cf](https://github.com/anncwb/vue-vben-admin/commit/e0dc5cf2f299fd4c1efdf4f00b9f0f72f07d5937))
- **description:** ensure that props respond ([ce93e46](https://github.com/anncwb/vue-vben-admin/commit/ce93e46faf1d7250dd3acd3fd97ccd6382b2f822))
- **form:** allow the setFieldsValue method to be null or undefined close [#320](https://github.com/anncwb/vue-vben-admin/issues/320) ([8f76ef4](https://github.com/anncwb/vue-vben-admin/commit/8f76ef4e70de58ba5c4497d8b10a036a54a9ac87))
- **form:** ensure that the Form component does not verify hidden form items ([43a45b7](https://github.com/anncwb/vue-vben-admin/commit/43a45b7c996c84f19d00cb9754277b943daf9a10))
- **form:** fix the problem of form props monitoring close [#322](https://github.com/anncwb/vue-vben-admin/issues/322) ([83a3460](https://github.com/anncwb/vue-vben-admin/commit/83a34603562e6358203b834b8feb59b0b44dbbcd))
- **menu:** fix menu icon missing close [#328](https://github.com/anncwb/vue-vben-admin/issues/328) ([d5d4c4b](https://github.com/anncwb/vue-vben-admin/commit/d5d4c4b4136158e061e4a3b6b306af6d4e8cd621))
- **table:** fix pagination error ([745fcfc](https://github.com/anncwb/vue-vben-admin/commit/745fcfc014e3e9e13d6a415a8f094cfef68be908))
- **tree:** fix the logic problem of show attribute of ActionItem under BasicTree ([80b47c8](https://github.com/anncwb/vue-vben-admin/commit/80b47c84cd490388c6db659921f1103c443d7b9d))

### Features

- add SvgIcon component ([9c2a2a0](https://github.com/anncwb/vue-vben-admin/commit/9c2a2a0c00dae6f334c99acc9ab2f571fd8905c0))
- **tree:** add clickRowToExpand option close [#318](https://github.com/anncwb/vue-vben-admin/issues/318) ([e696089](https://github.com/anncwb/vue-vben-admin/commit/e696089660131786ea24632ed75adc57b6ea58f4))

### Performance Improvements

- optimize local loading speed close [#329](https://github.com/anncwb/vue-vben-admin/issues/329) ([491f1fc](https://github.com/anncwb/vue-vben-admin/commit/491f1fcfff17f2297e3fee00e1542778aed08e56))
- **login:** enter to log in ([b93f20f](https://github.com/anncwb/vue-vben-admin/commit/b93f20f0df91689191b8414657171e9f17ba5d68))
- **table:** the table fills the height according to the screen close [#310](https://github.com/anncwb/vue-vben-admin/issues/310) ([551fe50](https://github.com/anncwb/vue-vben-admin/commit/551fe50a44d0b6358cf3861f772ca223ea56f0e2))

## [2.0.2](https://github.com/anncwb/vue-vben-admin/compare/v2.0.0...v2.0.2) (2021-03-03)

### Bug Fixes

- change transition-duration to make animate smoothly ([#294](https://github.com/anncwb/vue-vben-admin/issues/294)) ([5eac9b2](https://github.com/anncwb/vue-vben-admin/commit/5eac9b23d6d8ad91e110169519bfd3ab50f985a9))
- ensure that storage is deleted correctly close [#292](https://github.com/anncwb/vue-vben-admin/issues/292) ([ec7bef7](https://github.com/anncwb/vue-vben-admin/commit/ec7bef792b2a780736c2b1713af3638fa0b69eed))
- ensure that the correct components are dynamically imported ([b476e1c](https://github.com/anncwb/vue-vben-admin/commit/b476e1c84c52dab7030fd19b34ecd33e65fadcb2))
- ensure to request the interface correctly ([11d3f39](https://github.com/anncwb/vue-vben-admin/commit/11d3f395caf7e2268630090eb34f4e5c114a96b7))
- expose tree information in the event close [#315](https://github.com/anncwb/vue-vben-admin/issues/315) ([b6bb816](https://github.com/anncwb/vue-vben-admin/commit/b6bb81630de728c146bf0e559bef88b69d4b8a21))
- fix login page style ([7b4fcd2](https://github.com/anncwb/vue-vben-admin/commit/7b4fcd2ecac8107f7d052dee08cb8007dc5e5dd9))
- improve persistent cache logic ([15567e4](https://github.com/anncwb/vue-vben-admin/commit/15567e478c0f274b0f8f0a7410ea5cb636bacc3d))
- **dashboard:** fix workbench page style ([#280](https://github.com/anncwb/vue-vben-admin/issues/280)) ([7d9b521](https://github.com/anncwb/vue-vben-admin/commit/7d9b521c693b59da5fa28130b5753afa0914e598))
- **image:** fix preview style close [#276](https://github.com/anncwb/vue-vben-admin/issues/276) ([f675fff](https://github.com/anncwb/vue-vben-admin/commit/f675fff2e66054b4157b2a330dbf151822b0befd))
- **login:** fix login style close [#306](https://github.com/anncwb/vue-vben-admin/issues/306) ([a84586e](https://github.com/anncwb/vue-vben-admin/commit/a84586e2f49a2966ac5cb02d945e62e107b247d1))
- **modal:** ensure that the height is correct in the modal full screen state close [#308](https://github.com/anncwb/vue-vben-admin/issues/308) ([37508ca](https://github.com/anncwb/vue-vben-admin/commit/37508ca4113701458cae84fff64062427ba43898))
- **style:** fix anticon style ([e250ad5](https://github.com/anncwb/vue-vben-admin/commit/e250ad567f3169d4ef7baec8954be2e18c6932e6))
- **table:** ensure the table setting button dividing line is hidden ([7c2f851](https://github.com/anncwb/vue-vben-admin/commit/7c2f85169248b369f95c5866ef7e90d4fb1739ef))
- **table:** fix known errors in editable tables close [#267](https://github.com/anncwb/vue-vben-admin/issues/267) ([4f8e1c1](https://github.com/anncwb/vue-vben-admin/commit/4f8e1c1b5ffc78242b300e85be22b1fa07c7d902))
- **table:** get the selected rows of the table correctly ([6013689](https://github.com/anncwb/vue-vben-admin/commit/601368921f075aa1870d1c3ce8f4a8330260206a))
- **watermark:** watermark causes a blank bar ([#297](https://github.com/anncwb/vue-vben-admin/issues/297)) ([66fc1b7](https://github.com/anncwb/vue-vben-admin/commit/66fc1b78450fa7846b0d58e6da5f2135e6456238))

### Features

- added system management sample page ([4628d94](https://github.com/anncwb/vue-vben-admin/commit/4628d94415c1787da8b04499e295967f15c4eef5))
- **icon-picker:** add icon-picker component ([b6cea4a](https://github.com/anncwb/vue-vben-admin/commit/b6cea4a950e92a0f91e06bcc60b4653e1d2709ef))
- **moda;:** can switch full screen by double-clicking on the head close [#277](https://github.com/anncwb/vue-vben-admin/issues/277) ([e3851dc](https://github.com/anncwb/vue-vben-admin/commit/e3851dc5ea290ef6eb4d12ce2469311b1bee53cd))
- **tree:** actionItem added show attribute close [#314](https://github.com/anncwb/vue-vben-admin/issues/314) ([8b62fa0](https://github.com/anncwb/vue-vben-admin/commit/8b62fa0cb0559ec3ea8a1b82a2d44165b2337522))
- **tree:** add renderIcon props close [#309](https://github.com/anncwb/vue-vben-admin/issues/309) ([72b42d7](https://github.com/anncwb/vue-vben-admin/commit/72b42d7b3539919a9baa4f1a7316842f85991c1e))
- **ws:** added WebSocket examples and service scripts ([c625462](https://github.com/anncwb/vue-vben-admin/commit/c625462e98eec006aaeeef14280775cafeb72364))
- add dept management page ([3b8ca42](https://github.com/anncwb/vue-vben-admin/commit/3b8ca420c763fe0e386a8dbc023f4f8eb8742252))
- added settingButtonPosition configuration close [#275](https://github.com/anncwb/vue-vben-admin/issues/275) ([da04913](https://github.com/anncwb/vue-vben-admin/commit/da04913ef324fff122732b445c1b1d1d662b87a3))
- axios supports form-data format requests ([c41fa75](https://github.com/anncwb/vue-vben-admin/commit/c41fa75265beb00f629dcda808957cb58b905bc2))

### Performance Improvements

- **tree:** strengthen BasicTree function ([cd8e924](https://github.com/anncwb/vue-vben-admin/commit/cd8e924d4641fc46cacd4a934478d8861e8c3c04))
- hide table full screen button by default ([500900a](https://github.com/anncwb/vue-vben-admin/commit/500900abe16d3e27e1c9e0446a13386c6129d449))
- imporve axios logic ([a821d9a](https://github.com/anncwb/vue-vben-admin/commit/a821d9a3a279f0e6a5b7dbb316725d603ce30f74))
- improve login logic ([a09a0ee](https://github.com/anncwb/vue-vben-admin/commit/a09a0eedd29fdc9a9bd5414bd12c08e37c72982a))
- improve persistent logic ([f57eb94](https://github.com/anncwb/vue-vben-admin/commit/f57eb944edfd967f5f45566ec5bedbf12f147492))
- move src/types to root ([fcee7d4](https://github.com/anncwb/vue-vben-admin/commit/fcee7d4eb71471dd40567c8d7c97302eeee80697))
- remove useless code ([be3a3ed](https://github.com/anncwb/vue-vben-admin/commit/be3a3ed699f73d352d49623ef07288093a3332c4))
- replace crypto-es with crypto-js ([bba7768](https://github.com/anncwb/vue-vben-admin/commit/bba7768759c5d4dedd6599417154c4cb8ab64920))

## [2.0.1](https://github.com/anncwb/vue-vben-admin/compare/v2.0.0...v2.0.1) (2021-02-21)

### Bug Fixes

- **dashboard:** fix workbench page style ([#280](https://github.com/anncwb/vue-vben-admin/issues/280)) ([7d9b521](https://github.com/anncwb/vue-vben-admin/commit/7d9b521c693b59da5fa28130b5753afa0914e598))
- **image:** fix preview style close [#276](https://github.com/anncwb/vue-vben-admin/issues/276) ([f675fff](https://github.com/anncwb/vue-vben-admin/commit/f675fff2e66054b4157b2a330dbf151822b0befd))
- **style:** fix anticon style ([e250ad5](https://github.com/anncwb/vue-vben-admin/commit/e250ad567f3169d4ef7baec8954be2e18c6932e6))
- **table:** fix known errors in editable tables close [#267](https://github.com/anncwb/vue-vben-admin/issues/267) ([4f8e1c1](https://github.com/anncwb/vue-vben-admin/commit/4f8e1c1b5ffc78242b300e85be22b1fa07c7d902))

### Features

- **moda;:** can switch full screen by double-clicking on the head close [#277](https://github.com/anncwb/vue-vben-admin/issues/277) ([e3851dc](https://github.com/anncwb/vue-vben-admin/commit/e3851dc5ea290ef6eb4d12ce2469311b1bee53cd))
- added settingButtonPosition configuration close [#275](https://github.com/anncwb/vue-vben-admin/issues/275) ([da04913](https://github.com/anncwb/vue-vben-admin/commit/da04913ef324fff122732b445c1b1d1d662b87a3))

# [2.0.0](https://github.com/anncwb/vue-vben-admin/compare/v2.0.0-rc.18...v2.0.0) (2021-02-17)

### Bug Fixes

- **i18n:** fix useMessage i18n type [#262](https://github.com/anncwb/vue-vben-admin/issues/262) ([d753155](https://github.com/anncwb/vue-vben-admin/commit/d7531554a274ad9d793ea621739dfffdc7f73db8))
- **table:** fix the table in the editable row status and press Enter to confirm [#258](https://github.com/anncwb/vue-vben-admin/issues/258) ([64533f6](https://github.com/anncwb/vue-vben-admin/commit/64533f6204f96f79c6006d9911e9417cd9800d0d))
- correct debugger code ([759e532](https://github.com/anncwb/vue-vben-admin/commit/759e5320790504f0d274289001543c1397e8b617))
- some color error ([33b2365](https://github.com/anncwb/vue-vben-admin/commit/33b2365f6e645edf2a6c1cf38596aaec52b35df6))
- **description:** not rendering while show method return false ([#253](https://github.com/anncwb/vue-vben-admin/issues/253)) ([23eba27](https://github.com/anncwb/vue-vben-admin/commit/23eba274560a294f50e4b7c529ae8a63a266fb87)), closes [#252](https://github.com/anncwb/vue-vben-admin/issues/252)
- fix collapse header title not rendering ([#256](https://github.com/anncwb/vue-vben-admin/issues/256)) ([c81d48e](https://github.com/anncwb/vue-vben-admin/commit/c81d48e734b09217fa42df2358e616a970006eab))
- **pop-confirm-button:** fix responsive failure [#246](https://github.com/anncwb/vue-vben-admin/issues/246) ([c57dea0](https://github.com/anncwb/vue-vben-admin/commit/c57dea0438fc5ba0fbf1716b9e76e2fba1f33f84))
- fix the problem of mock error under post [#247](https://github.com/anncwb/vue-vben-admin/issues/247) ([9b6f37c](https://github.com/anncwb/vue-vben-admin/commit/9b6f37caef75f8752ea8bd07a78377dcaa59922b))
- suppoer build sourcemap ([3ba8285](https://github.com/anncwb/vue-vben-admin/commit/3ba828558646a7fa233ebbbda27f71c3121dd7c7))
- **type:** fix .vue file type error ([22088e8](https://github.com/anncwb/vue-vben-admin/commit/22088e820c79a9832179c8fb7c5cffe30b9b57e9))
- **upload:** fix maxNumber not work [#240](https://github.com/anncwb/vue-vben-admin/issues/240) ([91e004e](https://github.com/anncwb/vue-vben-admin/commit/91e004e21148c38e572cfbb6b75f0a6f353c15b6))

### Features

- added brotli|gzip compression and related test commands ([993538d](https://github.com/anncwb/vue-vben-admin/commit/993538de21dbb9e54e308afb40ff096ba0ab0e19))
- support echarts 5.0 ([370b12f](https://github.com/anncwb/vue-vben-admin/commit/370b12f5154f4a531c3a27c3ccc2601845872344))
- **modal:** exporse redoModalHeight ([a3a903b](https://github.com/anncwb/vue-vben-admin/commit/a3a903bc86e7248424f94f734d21c86c5327ed20))

### Performance Improvements

- adjust the return value of the interface to obtain user information in array format [#259](https://github.com/anncwb/vue-vben-admin/issues/259) ([5894093](https://github.com/anncwb/vue-vben-admin/commit/589409305f58ebc2f6b110bd7b31f924ecd06c16))
- remove unless code ([2365754](https://github.com/anncwb/vue-vben-admin/commit/23657547ab28fa65c2369ded8e73929dee76c750))
- update style ([aaae668](https://github.com/anncwb/vue-vben-admin/commit/aaae66835a9f1bdfa316e187c01557e5b54959ab))

# [2.0.0-rc.18](https://github.com/anncwb/vue-vben-admin/compare/v2.0.0-rc.17...v2.0.0-rc.18) (2021-02-04)

### Bug Fixes

- **build:** fix rollup compact not work ([783e658](https://github.com/anncwb/vue-vben-admin/commit/783e65813d41ad9a3030412edede6f25f8f8cb49))
- **descriotion:** fix type [#228](https://github.com/anncwb/vue-vben-admin/issues/228) ([4909a4c](https://github.com/anncwb/vue-vben-admin/commit/4909a4cb25ee62661e38cac38a8c3a388fdabbdf))
- **form:** format destructuring assignment error ([#238](https://github.com/anncwb/vue-vben-admin/issues/238)) ([612995a](https://github.com/anncwb/vue-vben-admin/commit/612995a5326ef183d9f454059da6a2914ce5dd2f))
- **menu:** fix the menu outside link does not jump ([55d4b77](https://github.com/anncwb/vue-vben-admin/commit/55d4b77b04d7a87b416a37019fbf047df1eeec41))
- **menu:** top submenu disappeared problem [#214](https://github.com/anncwb/vue-vben-admin/issues/214) ([0ec1a62](https://github.com/anncwb/vue-vben-admin/commit/0ec1a62e596c363f3f017d6ac3b374a1b5caa7c5))
- **modal:** fullscreen height calculation error [#203](https://github.com/anncwb/vue-vben-admin/issues/203) ([b45f8c5](https://github.com/anncwb/vue-vben-admin/commit/b45f8c5021a4225026ed698c083a1af42a08faff))
- **moment:** fix moment error [#217](https://github.com/anncwb/vue-vben-admin/issues/217) ([61cf0f7](https://github.com/anncwb/vue-vben-admin/commit/61cf0f791e8ee05676fe7fa382b6a2c2b1bea92d))
- **ripple:** fix ripple style [#211](https://github.com/anncwb/vue-vben-admin/issues/211) ([2201629](https://github.com/anncwb/vue-vben-admin/commit/22016291e4df206dbca351d00ae033c952276ebe))
- **table:** fix the table: cancel editing and not restore the initial value [#235](https://github.com/anncwb/vue-vben-admin/issues/235) ([1d0ec36](https://github.com/anncwb/vue-vben-admin/commit/1d0ec3629f9cdd40c16b62ce61f9230dcd56a82f))
- modifyVars not work ([b107b52](https://github.com/anncwb/vue-vben-admin/commit/b107b5288695130592a82951012b743fc825880f))
- **optimize-deps:** fix resize-observer-polyfill error ([1fac4b4](https://github.com/anncwb/vue-vben-admin/commit/1fac4b4ba76d432b9a56e142a8d56571e825950f))
- **simple-menu:** collapse openmenus error [#204](https://github.com/anncwb/vue-vben-admin/issues/204) ([ca4f1a8](https://github.com/anncwb/vue-vben-admin/commit/ca4f1a8faf7d588c0d57d0dc81f4dc04cd757380))
- **table:** cell content does not wrap [#210](https://github.com/anncwb/vue-vben-admin/issues/210) ([ea93553](https://github.com/anncwb/vue-vben-admin/commit/ea9355398fe89235bf2e657c291541bd79a41d98))
- **table:** fix the initial data display of editable cells ([#218](https://github.com/anncwb/vue-vben-admin/issues/218)) ([9ea257e](https://github.com/anncwb/vue-vben-admin/commit/9ea257e1fbd9e50369b0065eb4db37d4f9c24970))
- **use-table:** fix types ([c889fb1](https://github.com/anncwb/vue-vben-admin/commit/c889fb174bbd8301479cd67ed99cb5f3552f9988))
- error action style ([da64c1d](https://github.com/anncwb/vue-vben-admin/commit/da64c1dac95b96984283e496070ab9dc086dca4d))

### Features

- production mode compressed image ([de332ae](https://github.com/anncwb/vue-vben-admin/commit/de332ae3f55afa611e86322753d5a713ea00307d))
- theme color switch ([3d1681e](https://github.com/anncwb/vue-vben-admin/commit/3d1681ee9ae2b8e8a8f9d7afeaef3b059aa20b48))
- vite preview ([c1a4600](https://github.com/anncwb/vue-vben-admin/commit/c1a4600b8a0f42c37d90c05198627062eb5742e2))
- **api-select:** added numberToString prop [#200](https://github.com/anncwb/vue-vben-admin/issues/200) ([5d51d48](https://github.com/anncwb/vue-vben-admin/commit/5d51d48787f7b96637bc6abe5175578e0263092a))

### Performance Improvements

- **form:** perf form in modal ([2882d6e](https://github.com/anncwb/vue-vben-admin/commit/2882d6e937a7d4996ae42ff62148d9a2f893fe47))
- **mock:** when mock is not used, move mock.js out of the package file ([43503d5](https://github.com/anncwb/vue-vben-admin/commit/43503d597028926c93e4624d999cad4bbccc75fb))
- **nprocess:** remove nprocess css ([733afdd](https://github.com/anncwb/vue-vben-admin/commit/733afddd19523550d8c7df5c523a0b0929afc608))

### Reverts

- vite previre ([2eb2d2a](https://github.com/anncwb/vue-vben-admin/commit/2eb2d2a07529f7a33d2fbbf1e5fc2e1aac706b0f))

# [2.0.0-rc.17](https://github.com/anncwb/vue-vben-admin/compare/v2.0.0-rc.16...v2.0.0-rc.17) (2021-01-18)

### Bug Fixes

- **menu:** currentActiveMenu fails after refresh [#188](https://github.com/anncwb/vue-vben-admin/issues/188) ([6d5c49f](https://github.com/anncwb/vue-vben-admin/commit/6d5c49f0a208de5b745c36d2320dd4c2cffe7d75))
- **menu-trigger:** menu-trigger lost ([b803c41](https://github.com/anncwb/vue-vben-admin/commit/b803c4100d5b40c04ae4c3b7153f7f8f32d7da81))
- **mitt:** logout and clear the mitt ([0aeec5e](https://github.com/anncwb/vue-vben-admin/commit/0aeec5e9d727fc6291fa2d6edaedb4c3e1ef0dad))
- **table:** index column value error [#187](https://github.com/anncwb/vue-vben-admin/issues/187) ([056fc13](https://github.com/anncwb/vue-vben-admin/commit/056fc131168c4e900e9257c3e03257a390c3d3ba))
- **table:** tableAction icon [#182](https://github.com/anncwb/vue-vben-admin/issues/182) ([b9d53a7](https://github.com/anncwb/vue-vben-admin/commit/b9d53a7133de70922d6f2a0e16e5b623ffab84fb))

### Features

- css import on demand ([c2f6542](https://github.com/anncwb/vue-vben-admin/commit/c2f6542b48abb85b2c80d13a36882899b11c140b))

### Performance Improvements

- auto import mock file ([df6b5e9](https://github.com/anncwb/vue-vben-admin/commit/df6b5e926f3384a1c56e6607a39efcc4638e8dbc))

# [2.0.0-rc.16](https://github.com/anncwb/vue-vben-admin/compare/v2.0.0-rc.15...v2.0.0-rc.16) (2021-01-12)

### Bug Fixes

- **table:** table setting error [#174](https://github.com/anncwb/vue-vben-admin/issues/174) [#165](https://github.com/anncwb/vue-vben-admin/issues/165) ([c960020](https://github.com/anncwb/vue-vben-admin/commit/c9600208c52e3575fe8741e350833f7952bae3b7))
- mock plugin error [#171](https://github.com/anncwb/vue-vben-admin/issues/171) ([3509ebe](https://github.com/anncwb/vue-vben-admin/commit/3509ebec165d26651cc02dc233bd9433c544bed5))
- upload component not work [#169](https://github.com/anncwb/vue-vben-admin/issues/169) ([18ad1bc](https://github.com/anncwb/vue-vben-admin/commit/18ad1bcc6e927f70dc16bf7e3c1627c1f7f376f3))
- useI18n type ([c22de5c](https://github.com/anncwb/vue-vben-admin/commit/c22de5c35b4781322c9ee17ad375ec0af2fe60a7))
- **form:** formAction slot not work ([de5bf75](https://github.com/anncwb/vue-vben-admin/commit/de5bf757f241a097d62d61adf4d7346b73a09f92))
- **layout:** fix layout scale error ([da76f3c](https://github.com/anncwb/vue-vben-admin/commit/da76f3c77bd044caaf65e2c7a5c1c9dd72b4ca44))
- **modal:** height calc error [#161](https://github.com/anncwb/vue-vben-admin/issues/161) ([144ab57](https://github.com/anncwb/vue-vben-admin/commit/144ab577da06ff0bd1f258d1901b87864f232e45))
- **table:** fix edit-table not work ([c031163](https://github.com/anncwb/vue-vben-admin/commit/c031163f34d7ec16aa5a7a406d5467a18e527c79))
- **table:** fix table setting error [#162](https://github.com/anncwb/vue-vben-admin/issues/162) ([a2c89d2](https://github.com/anncwb/vue-vben-admin/commit/a2c89d2e842beb9f15f3fc00d651c42954a57ff7))
- **table:** restore the property of the table ([5c27353](https://github.com/anncwb/vue-vben-admin/commit/5c2735346745cf91aa9812a0afbf62e4625faf40))
- **table:** table columns setting error ([af55511](https://github.com/anncwb/vue-vben-admin/commit/af55511bd6e533ab68356aa9038f80f50f53cf26))
- **table:** table columns setting will uncheck all render columns [#154](https://github.com/anncwb/vue-vben-admin/issues/154) ([aa596af](https://github.com/anncwb/vue-vben-admin/commit/aa596af608a313a5494db8e3ddbf0ef84c7f0c55))
- **table:** table memory overflow ([7a07b70](https://github.com/anncwb/vue-vben-admin/commit/7a07b703d11afb832daa4bd2b87bf5cab3c61e04))
- **transition:** fix transition not work ([a7a8b89](https://github.com/anncwb/vue-vben-admin/commit/a7a8b894c1062d8eb05a094fdbb7887044d0d973))
- invalid error-log page path ([#158](https://github.com/anncwb/vue-vben-admin/issues/158)) ([17ecaea](https://github.com/anncwb/vue-vben-admin/commit/17ecaea97d1d4c61ddb79a23616a49598c9a10aa))

### Features

- **tinymce:** add image upload [#170](https://github.com/anncwb/vue-vben-admin/issues/170) ([3ad1a4f](https://github.com/anncwb/vue-vben-admin/commit/3ad1a4f5a69b4242d55e6bc17aceab7279241e14))
- added mixSide trigger ([1e5fcd2](https://github.com/anncwb/vue-vben-admin/commit/1e5fcd2cd2981b29f06cff08e588077b2dd02f45))
- support vite2 ([eba5576](https://github.com/anncwb/vue-vben-admin/commit/eba55769ec765cd4fbf1faefdd4f3df5e38f11d9))
- **layout:** added setting. Used to fix the left mixed mode menu ([97180e8](https://github.com/anncwb/vue-vben-admin/commit/97180e83f5055ebd138acc2a82c981d8a7399371))
- **menu:** add mixSideTrigger setting ([0419a07](https://github.com/anncwb/vue-vben-admin/commit/0419a070413be34ea5455ed955fa51d8c522da86))
- **modal:** add minHeight and height prop [#156](https://github.com/anncwb/vue-vben-admin/issues/156) ([5091a87](https://github.com/anncwb/vue-vben-admin/commit/5091a875ab520c51aec4c57cdd200d68016958ab))
- **page-wrapper:** added pageWrapper component ([31ff055](https://github.com/anncwb/vue-vben-admin/commit/31ff0559fe3b635fc2091aac0e2f5e340629134c))
- **table:** add summaryData prop [#163](https://github.com/anncwb/vue-vben-admin/issues/163) ([8d7d083](https://github.com/anncwb/vue-vben-admin/commit/8d7d0835adf4a7d1b8afc5e8bd911a60833006a4))
- **tabs:** added tab folding ([0e7c57b](https://github.com/anncwb/vue-vben-admin/commit/0e7c57bd5ecafd8283bcc950b24bb63b59b70e5a))

### Performance Improvements

- perf table ([cdf0a60](https://github.com/anncwb/vue-vben-admin/commit/cdf0a600e505daf429446b8a7968269e1034de04))
- **i18n:** merge common lang ([efbde0d](https://github.com/anncwb/vue-vben-admin/commit/efbde0d57e20d07373d78d1226e2e83f396a74f3))
- add @ant-design/icons-vue to optimizeDeps ([fb57cf7](https://github.com/anncwb/vue-vben-admin/commit/fb57cf734da31af94f3072c685b778a64fc740a5))
- **menu:** mixSideTrigger setting ([#155](https://github.com/anncwb/vue-vben-admin/issues/155)) ([e821f4c](https://github.com/anncwb/vue-vben-admin/commit/e821f4c706c4108a4309a0589223e05e718f15cf))

# [2.0.0-rc.15](https://github.com/anncwb/vue-vben-admin/compare/v2.0.0-rc.14...v2.0.0-rc.15) (2020-12-31)

### Bug Fixes

- **build:** fix environment variable configuration file failure ([bd7b53f](https://github.com/anncwb/vue-vben-admin/commit/bd7b53f14adc05fd3d4af5027b5fb85015021ac9))
- **charts:** fix echarts does not display after refresh [#140](https://github.com/anncwb/vue-vben-admin/issues/140) ([5cbfb2a](https://github.com/anncwb/vue-vben-admin/commit/5cbfb2a1f9ace8b991ac67c5b7d37b64eb2dbac8))
- **demo:** fix demo error ([a0681cc](https://github.com/anncwb/vue-vben-admin/commit/a0681cca8f9de2e3686001fa715f53f6fc3cf1a1))
- **form:** fix appendSchemaByField not work ([405d746](https://github.com/anncwb/vue-vben-admin/commit/405d7466dd935a845e91f4c6ece76b1475507eb7))
- **form:** form validate error ([a305e59](https://github.com/anncwb/vue-vben-admin/commit/a305e59124f4cc88aaf6ec85a13fc998a18b9471))
- **form:** form-item style error ([08df198](https://github.com/anncwb/vue-vben-admin/commit/08df198710ff597af2cbffa2afbb3a6ca13a1d63))
- **iframe:** iframe loads early when closing multi-tabs ([73cee06](https://github.com/anncwb/vue-vben-admin/commit/73cee06daa26c056131fb5ec78afd912dd9832f7))
- **locale:** fix locale.show not work ([10cd4fc](https://github.com/anncwb/vue-vben-admin/commit/10cd4fcdff2fa3961e095285ae7a26b38be52c2a))
- **menu:** fix scrillbar not work ([de25557](https://github.com/anncwb/vue-vben-admin/commit/de25557f86945a96b89294043796ccf4ab476ad5))
- **modal:** do not hide the scroll bar when opening the pop-up window [#151](https://github.com/anncwb/vue-vben-admin/issues/151) ([8f332e3](https://github.com/anncwb/vue-vben-admin/commit/8f332e3cd45814a181a24c884edf050936928755))
- **sider:** mix mode adaptation in the left menu ([ed213d8](https://github.com/anncwb/vue-vben-admin/commit/ed213d878b78697f0bdb69cb474dfab45972b2cb))
- **table:** Update useDataSource.ts ([#131](https://github.com/anncwb/vue-vben-admin/issues/131)) ([877311f](https://github.com/anncwb/vue-vben-admin/commit/877311f9df70b7d76f8a0f8b5082f061de439ec8))
- **table:** wrong tag label style [#134](https://github.com/anncwb/vue-vben-admin/issues/134) ([e09e0a1](https://github.com/anncwb/vue-vben-admin/commit/e09e0a12531977d679ab0f4574f4016d4c5b2ad0))
- **tinymce:** the editor reports an error under keep-alive [#152](https://github.com/anncwb/vue-vben-admin/issues/152) ([09c9f8a](https://github.com/anncwb/vue-vben-admin/commit/09c9f8a881d1f2c76b11fdeff08f3ca2893e0886))
- **types:** fix routing type error [#145](https://github.com/anncwb/vue-vben-admin/issues/145) ([b6e5c3f](https://github.com/anncwb/vue-vben-admin/commit/b6e5c3f625f3e30b1fa7433e57b1294a8ce8d04b))
- add an example of markdown embedded in the form [#138](https://github.com/anncwb/vue-vben-admin/issues/138) ([7db0c5c](https://github.com/anncwb/vue-vben-admin/commit/7db0c5c49f23a4ab4958b3f73d47516deafa6166))

### Features

- **breadcrumb:** add breadcrumb demo [#143](https://github.com/anncwb/vue-vben-admin/issues/143) ([819bcbe](https://github.com/anncwb/vue-vben-admin/commit/819bcbe5263c721f1f77cb277d670a9868b229f7))
- **hook:** add useKeyPress ([3c3e640](https://github.com/anncwb/vue-vben-admin/commit/3c3e640d69b48d8e9382acd25b60d906af038a9d))
- add mainout page demo ([930383f](https://github.com/anncwb/vue-vben-admin/commit/930383f9ae17b18d697a35ef9c73ad17dbca1e13))
- **layout:** add mix sidebar mode ([e6db0d3](https://github.com/anncwb/vue-vben-admin/commit/e6db0d39b9ba98f6396866715ed3b6d56994697a))
- add ripple directive ([2e79c9f](https://github.com/anncwb/vue-vben-admin/commit/2e79c9f37adda4003e6b054561b26da69a762673))

### Performance Improvements

- **form:** improve the form function ([ac1a369](https://github.com/anncwb/vue-vben-admin/commit/ac1a36950259844822c6300a00710b040dfc2640))
- **import:** perf components import ([2ee01fa](https://github.com/anncwb/vue-vben-admin/commit/2ee01fa6ea3200ec964d4e1b4765e48dfa7aeb3a))
- **modal-drawer:** replace the scrollbar assembly ([ebf7c8a](https://github.com/anncwb/vue-vben-admin/commit/ebf7c8aa53b7ed11c72734646d558a559e818473))
- **route:** refactor guard ([3b126e0](https://github.com/anncwb/vue-vben-admin/commit/3b126e011c7ca7ac1b008c37aa2cf617242a2e9c))
- Update useApexCharts.ts ([#139](https://github.com/anncwb/vue-vben-admin/issues/139)) ([5eecec0](https://github.com/anncwb/vue-vben-admin/commit/5eecec03126d131bd1210d4fcac3acfe3d5aeb40))

# [2.0.0-rc.14](https://github.com/anncwb/vue-vben-admin/compare/2.0.0-beta.3...v2.0.0-rc.14) (2020-12-15)

### Bug Fixes

- **form:** fix the form item setting not taking effect ([6936adb](https://github.com/anncwb/vue-vben-admin/commit/6936adb2c2af3c0bfbd238be1d61933601ff2b88))
- **router:** reserving `Redirect` after reset ([#126](https://github.com/anncwb/vue-vben-admin/issues/126)) ([ec7efcf](https://github.com/anncwb/vue-vben-admin/commit/ec7efcf0f0161c8e14168bf69ba27ba36e2a1ac8))
- fix modal and drawer component missing uid ([1293a73](https://github.com/anncwb/vue-vben-admin/commit/1293a7389ea797b1c1dad62e06657c846b1dcb3c))
- **comp:** fix the memory overflow problem of component containing keywords ([6b3195b](https://github.com/anncwb/vue-vben-admin/commit/6b3195b4ca88a33044bcd014e8c5d090710e7fbb))
- **form:** fix baseColProps not work ([c8ef82b](https://github.com/anncwb/vue-vben-admin/commit/c8ef82b2c11c9938f0f7a7f6a1a10010b82979dc))
- **form:** fix form inputNumber verification error ([4ddee05](https://github.com/anncwb/vue-vben-admin/commit/4ddee05dee87c944ba95dca54a754e048b8cfc84))
- **form:** fix form verification and console error message issues ([bb1b267](https://github.com/anncwb/vue-vben-admin/commit/bb1b267e2fc306608300ec09084b1f3d0cab7e59))
- **icon:** fix g-icon not work ([f7ec3c9](https://github.com/anncwb/vue-vben-admin/commit/f7ec3c931e780b2b5d35bf65ea5b4ace26f7c356))
- **keep-alive:** fix the problem that the multi-level routing cache page is rendered multiple times [#123](https://github.com/anncwb/vue-vben-admin/issues/123) ([0daca28](https://github.com/anncwb/vue-vben-admin/commit/0daca28362419911d642e4b3a5111e213eef49d9))
- **login:** fix the problem of successful login and notify disappearing ([0434030](https://github.com/anncwb/vue-vben-admin/commit/0434030f2777ee65a4255287e1842fcb0b772f87))
- **menu:** calc 0 不能省略单位 ([#124](https://github.com/anncwb/vue-vben-admin/issues/124)) ([d023fb1](https://github.com/anncwb/vue-vben-admin/commit/d023fb13742cc1f5cc1585b82f1a7b3c576ee66c))
- **menu:** fix externalLink not work ([7bae4c3](https://github.com/anncwb/vue-vben-admin/commit/7bae4c37525c6534ec0b0c3ea8c1b2257af74a33))
- **menu:** fix menu icon style ([1bc237d](https://github.com/anncwb/vue-vben-admin/commit/1bc237d77a068e99b0e803ab4f16d8bbcf54ff6b))
- **menu:** fix menu split mode problem ([1ef49e5](https://github.com/anncwb/vue-vben-admin/commit/1ef49e542d23ca44696ec5dd2f6498a4ea8135aa))
- **theme:** css filter breaking fixed position ([#125](https://github.com/anncwb/vue-vben-admin/issues/125)) ([c911af4](https://github.com/anncwb/vue-vben-admin/commit/c911af4aca49e6f9fe099e74a4d454286554e181))
- 整体图标调整 ([5dc8226](https://github.com/anncwb/vue-vben-admin/commit/5dc8226ce14559f48f8b979809f8a054ce7935e5))
- file upload key loss [#120](https://github.com/anncwb/vue-vben-admin/issues/120) ([29461a8](https://github.com/anncwb/vue-vben-admin/commit/29461a856826fbb7726848982387ea78f8573754))
- **menu:** fix the calculation error of the top menu width ([de1f006](https://github.com/anncwb/vue-vben-admin/commit/de1f00628479c4d31e6ed904d4b0fd7e312cc030))
- **table:** fix table setting error ([59ad824](https://github.com/anncwb/vue-vben-admin/commit/59ad82442bf213bac547940086ff4e14d0cd342a))
- **table:** fix unsuccessful saving of row edit table ([#117](https://github.com/anncwb/vue-vben-admin/issues/117)) ([404db2f](https://github.com/anncwb/vue-vben-admin/commit/404db2fb4975c69851dbf73a9ea8f981fb0ddb56))
- **upload:** fix file upload key loss [#120](https://github.com/anncwb/vue-vben-admin/issues/120) ([fb5395b](https://github.com/anncwb/vue-vben-admin/commit/fb5395b5401b4b1f9e605d2721784482a76d49cc))
- **upload:** repair file upload and delete invalidation ([bd6b203](https://github.com/anncwb/vue-vben-admin/commit/bd6b203fa969d173574657940a50b649c778b0b4))
- fix cssVar hmr error ([2b95be8](https://github.com/anncwb/vue-vben-admin/commit/2b95be8013e70e1b891601cecb6d9e03a56d1ac2))
- fix descriotions title not work ([819127e](https://github.com/anncwb/vue-vben-admin/commit/819127e807123cccc7ae50f0fdffb43a662465d4))
- fix form submit error ([94bf854](https://github.com/anncwb/vue-vben-admin/commit/94bf854dd98f37ffb39e9086c565a0610c250205))
- fix form validate error ([1db72c8](https://github.com/anncwb/vue-vben-admin/commit/1db72c8fe13384f24e9cc1bdc839d5e4176ea9b4))
- fix keepAlive not work ([b884654](https://github.com/anncwb/vue-vben-admin/commit/b884654761f93455014fd1dcb0e40c030d8fb360))
- fix menu style not work ([bda3e5d](https://github.com/anncwb/vue-vben-admin/commit/bda3e5da30b434dd3a5879695261422fdd365455))
- fix mock data error [#109](https://github.com/anncwb/vue-vben-admin/issues/109) ([41a4b82](https://github.com/anncwb/vue-vben-admin/commit/41a4b827a22e785453238da6b9b8b5b1c604b91a))
- fix notify type error ([cb1ae34](https://github.com/anncwb/vue-vben-admin/commit/cb1ae34f1120d2555ff039fc945235c3f45e13a8))
- fix spelling errors of i18n words ([68a96b7](https://github.com/anncwb/vue-vben-admin/commit/68a96b7f81a1ad72c93a53c2ebfde046c66c215f))
- fix spin style ([fca0bb1](https://github.com/anncwb/vue-vben-admin/commit/fca0bb164a0f2e03acb5090bf59634225f5c06ee))
- fix table column settings not displayed by setting ([54d1405](https://github.com/anncwb/vue-vben-admin/commit/54d14056462566521f2528480c13fb24279156ae))
- fix the display problem of table icon ([de499a1](https://github.com/anncwb/vue-vben-admin/commit/de499a145556427304abe075b62e6869f44dc640))
- fix the original page after login expired ([6676c95](https://github.com/anncwb/vue-vben-admin/commit/6676c9506be7b3095c466c83432d40b2a36565fb))
- fix win system dynamicImport error ([a90d93f](https://github.com/anncwb/vue-vben-admin/commit/a90d93fc4d8dd8491702183f3db700c33dbcc5a8))
- page switching did not return to the top ([fef3644](https://github.com/anncwb/vue-vben-admin/commit/fef3644067b7ccac96ec9ae122e3f1c8b8fc58ef))
- pageLoading not working ([3f78b5a](https://github.com/anncwb/vue-vben-admin/commit/3f78b5aa0cd3e7a6f17d58512ca93ee2905d5e2f))
- style error ([7bfe5f7](https://github.com/anncwb/vue-vben-admin/commit/7bfe5f753d77620027248a6238bccd8a23f7ad7c))
- **charts:** fix useCharts resize not work ([6d9585b](https://github.com/anncwb/vue-vben-admin/commit/6d9585b46f849ea4cf3dc93d46f15c2c09d04891))
- **form:** fix updateSchema error [#100](https://github.com/anncwb/vue-vben-admin/issues/100) ([4982786](https://github.com/anncwb/vue-vben-admin/commit/498278660112a52b7c6e608159d20920d6047e04))
- 修复链接 ([#49](https://github.com/anncwb/vue-vben-admin/issues/49)) ([28392c3](https://github.com/anncwb/vue-vben-admin/commit/28392c3d6efc2fb3298255bc2c466167e8a4e91c))
- fix editable cells cannot be entered ([4500214](https://github.com/anncwb/vue-vben-admin/commit/4500214b2a158965281e43e673622e4492e8ca26))
- fix expandTransition ([3355066](https://github.com/anncwb/vue-vben-admin/commit/335506628e15e29e08df55d4b7e7cf6333fe25be))
- fix fullscreen bg color not work ([#75](https://github.com/anncwb/vue-vben-admin/issues/75)) ([0c28ffa](https://github.com/anncwb/vue-vben-admin/commit/0c28ffa8e6a93e8923b7d3a32292db8ae786242c))
- **table:** fix table typo ([69af37e](https://github.com/anncwb/vue-vben-admin/commit/69af37ec88e21acf926fdf5969c2189dc7450822))
- fix menu permission failure ([b8353fe](https://github.com/anncwb/vue-vben-admin/commit/b8353fe1f262b87cc20af56aaf380ae1a5599724))
- fix message type error ([35d2bfc](https://github.com/anncwb/vue-vben-admin/commit/35d2bfc5623fcf3a608ae12e9781b2e23ff4130d))
- fix the problem of closing multiple tabs ([275ad9f](https://github.com/anncwb/vue-vben-admin/commit/275ad9f14e8fa75620ff35c906c06c616fb2104f))
- **mock:** fix mock paging tool error ([b36d948](https://github.com/anncwb/vue-vben-admin/commit/b36d9486a544dd3badea23d86088af98aadad8f4))
- **table:** fix table search criteria collapse failure ([84b8302](https://github.com/anncwb/vue-vben-admin/commit/84b8302c0921ea7fbcd1c42fa057b94660129857))
- fix missing cache of refresh page ([02d6a39](https://github.com/anncwb/vue-vben-admin/commit/02d6a3940277a5939d25d16fda58e09346821e0e))
- fix npm build error ([a3b7a65](https://github.com/anncwb/vue-vben-admin/commit/a3b7a6537ae25af076fdcccb50dd6967f0def40b))
- fix table small style ([#67](https://github.com/anncwb/vue-vben-admin/issues/67)) ([da4aea1](https://github.com/anncwb/vue-vben-admin/commit/da4aea1399f67759b06266aa410036f69fde9521))
- **table:** fix table type error ([05980a8](https://github.com/anncwb/vue-vben-admin/commit/05980a817e68c2a57eed2db7cf23bd7eb4ec10ba))
- build error ([7bd0b8e](https://github.com/anncwb/vue-vben-admin/commit/7bd0b8eb6ffb143b4f341efeeb60b4e90f0e4ddf))
- fix abnormal breadcrumb status ([144fde8](https://github.com/anncwb/vue-vben-admin/commit/144fde8a688217440071c7b0ac70e46f6832635a))
- fix base-help style not work ([1fb759e](https://github.com/anncwb/vue-vben-admin/commit/1fb759ec7cf2c6104670025073920ca352413b10))
- fix drawer autoHeight ([88de82c](https://github.com/anncwb/vue-vben-admin/commit/88de82c493b068b6d9bb5e29475350ed092fe482))
- fix missing page refresh parameters ([349d197](https://github.com/anncwb/vue-vben-admin/commit/349d1978b154f6e9e74e36de7cc56a2ca261d0b0))
- fix modal dragging failure when destroyOnClose=true ([#51](https://github.com/anncwb/vue-vben-admin/issues/51)) ([9c02d8e](https://github.com/anncwb/vue-vben-admin/commit/9c02d8ec08b309e7f982f417a4c907f33ccc96f0))
- fix npm script ([b84de1a](https://github.com/anncwb/vue-vben-admin/commit/b84de1a515600d2ead1c2b5f6db949e7bf6ab923))
- fix require error ([06e1d38](https://github.com/anncwb/vue-vben-admin/commit/06e1d3879be187f99f5142e054884e1c09ac8dfa))
- fix routing switch, tab is not activated ([beb4c3a](https://github.com/anncwb/vue-vben-admin/commit/beb4c3a37f314b97657a1d85e7db2abf40dbe6c3))
- fix script preview no build ([c2333f5](https://github.com/anncwb/vue-vben-admin/commit/c2333f5d044c74c9df82c6c3134681ba21e0d0cd))
- fix table auto height ([ddc3786](https://github.com/anncwb/vue-vben-admin/commit/ddc3786b168a2931200ef61cc68dd80a18d714cc))
- fix the failure of table expansion icon animation ([8e885d6](https://github.com/anncwb/vue-vben-admin/commit/8e885d6967747f3204e61ca85bde25ac2b8ba2a4))
- fix the failure of table expansion icon animation ([db06289](https://github.com/anncwb/vue-vben-admin/commit/db06289481965524f42ed36a056bd54ba1a46dfe))
- fix the problem of folding display name of the first level menu ([e3cbc93](https://github.com/anncwb/vue-vben-admin/commit/e3cbc9326ecedf386919f344df5dbdef8eb3d78c))
- fix the problem of page blank caused by page refresh ([7653610](https://github.com/anncwb/vue-vben-admin/commit/7653610c7bc45e97cb744994835cf7fb5074ff7b))
- fix the style problem of the table border in the production environment ([f2c7638](https://github.com/anncwb/vue-vben-admin/commit/f2c7638bd7789bddacd56ea2ab809f4a0b3b86cb))
- fix the top menu adaptive failure ([2f12556](https://github.com/anncwb/vue-vben-admin/commit/2f12556d26ba386d9dca2ecf8a88e3764abab870))
- fix window npm script ([a0b09e7](https://github.com/anncwb/vue-vben-admin/commit/a0b09e74baf1f4e514da85ed9b1859ca2820fb37))
- form col style ([840332a](https://github.com/anncwb/vue-vben-admin/commit/840332abf733dd1dc404523d38c5377114f4b6c2))
- some error ([2407b33](https://github.com/anncwb/vue-vben-admin/commit/2407b3368c3fc5128bbfced98a1d2c70fa3e02e0))
- **modal:** fix modal not showing footer ([fb0c776](https://github.com/anncwb/vue-vben-admin/commit/fb0c7763eddde38d3746cb424ebe9662ac576c86))
- **tree:** fix tree style ([#99](https://github.com/anncwb/vue-vben-admin/issues/99)) ([e8ccdc7](https://github.com/anncwb/vue-vben-admin/commit/e8ccdc7f34891ea31768aea9ebcfc33227d37eb7))
- **use-redo:** refresh the page to keep the parameters([#104](https://github.com/anncwb/vue-vben-admin/issues/104)) ([e04aaa0](https://github.com/anncwb/vue-vben-admin/commit/e04aaa06459c6613e59aa6ae5906b998b0685bdb))
- fix the disappearance of tab switching parameters ([#56](https://github.com/anncwb/vue-vben-admin/issues/56)) ([6bffdb5](https://github.com/anncwb/vue-vben-admin/commit/6bffdb5c64aa139cf6119b50aeed42629a65f07b))
- fix the occupancy problem of the folding button ([#90](https://github.com/anncwb/vue-vben-admin/issues/90)) ([cd35d3e](https://github.com/anncwb/vue-vben-admin/commit/cd35d3e0d16cb57cb15c2ca20c8a663f21e4bfbf))
- fix the problem of collapsed display when the menu has no child nodes ([5cff73b](https://github.com/anncwb/vue-vben-admin/commit/5cff73bcafc27a36f111949d33f463dd2bb52571))
- fix topMenu align not work ([25d43a5](https://github.com/anncwb/vue-vben-admin/commit/25d43a5f7c9182f2ca620f1daf0d5f47d2e4fb2d))
- fix useTimeoutFn not work ([b49950a](https://github.com/anncwb/vue-vben-admin/commit/b49950a3906de6626eedb973590d02e4d95b98b9))
- hmr multiple registered components ([7a6181e](https://github.com/anncwb/vue-vben-admin/commit/7a6181e8c72cd110cdfc09f624f8be43e76ef74c))
- repair local development post request proxy to https error problem ([#63](https://github.com/anncwb/vue-vben-admin/issues/63)) ([34c09fc](https://github.com/anncwb/vue-vben-admin/commit/34c09fcea82e3529519a5acc563a22adcd5faae1))
- repair packaging error ([526e6ce](https://github.com/anncwb/vue-vben-admin/commit/526e6ce22bf15cd04a09faf53a08ac43da491534))
- Repair tree component click to select ([#33](https://github.com/anncwb/vue-vben-admin/issues/33)) ([67df9b8](https://github.com/anncwb/vue-vben-admin/commit/67df9b8c93a26b0edb4f3d5d5c589d355803cea0))
- replace taskfile module ([e828baa](https://github.com/anncwb/vue-vben-admin/commit/e828baa67b5f8e6fa28354d85563d127b6b70d6b))
- reset back to default value after fixing form query ([1c075a7](https://github.com/anncwb/vue-vben-admin/commit/1c075a7a32dd05454bc45d4eb686e2234c3c6175))
- the action column appears repeatedly in the table ([#53](https://github.com/anncwb/vue-vben-admin/issues/53)) ([74d4742](https://github.com/anncwb/vue-vben-admin/commit/74d47424069c4dca71579637916431aa80014fd8))
- the login tab page in tabs ([#60](https://github.com/anncwb/vue-vben-admin/issues/60)) ([bfac425](https://github.com/anncwb/vue-vben-admin/commit/bfac425d1e12943b55e9afb732a36d84f6a02404))
- the useMessage icon style problem ([a2c413a](https://github.com/anncwb/vue-vben-admin/commit/a2c413a838bb3f737e28e95302ccf0a0171c91b6))
- type error ([ecfb702](https://github.com/anncwb/vue-vben-admin/commit/ecfb702b09e296efd5bf095d65840147d47b7923))
- typo ([7658f4d](https://github.com/anncwb/vue-vben-admin/commit/7658f4d6e82dc532b378ec13157756f0e1cd78de))
- update account page demo ([#92](https://github.com/anncwb/vue-vben-admin/issues/92)) ([9f8796e](https://github.com/anncwb/vue-vben-admin/commit/9f8796ee586a5f33e20713f53d2aa447b6aa312e))
- update upload component ([815250e](https://github.com/anncwb/vue-vben-admin/commit/815250ed341ccaec23e7ea34db6cc478a47ad065))
- **excel:** update excel demo ([a207caf](https://github.com/anncwb/vue-vben-admin/commit/a207cafec98461b39882f352f2bf5c7d3c21716a))
- **table:** fix table actionColOptions not work ([5a6db8c](https://github.com/anncwb/vue-vben-admin/commit/5a6db8c640376ca67b451a9647b9958946e5c3ab))
- **table:** fix table type error ([db0bfc8](https://github.com/anncwb/vue-vben-admin/commit/db0bfc886314b193e7cb86a80b6c13b2743aa652))
- **table:** fix the problem that multi-level header configuration does not take effect ([cdf2c59](https://github.com/anncwb/vue-vben-admin/commit/cdf2c59e5c3b070d039c04fb746b53147f5e0ced))
- **tinymce:** fixed multiple editors showing only one ([#83](https://github.com/anncwb/vue-vben-admin/issues/83)) ([1093ec3](https://github.com/anncwb/vue-vben-admin/commit/1093ec3e6e4fe1f49b7458c29e518744fe56532f))

### Features

- add account center page ([#86](https://github.com/anncwb/vue-vben-admin/issues/86)) ([78d4d41](https://github.com/anncwb/vue-vben-admin/commit/78d4d41c85f5341bb5dfd2a1cbb6e60d6858b084))
- add accountSetting page ([#85](https://github.com/anncwb/vue-vben-admin/issues/85)) ([7ad4cee](https://github.com/anncwb/vue-vben-admin/commit/7ad4cee79ade617a13358f7417ce3e1182c1027f))
- add basic-list page ([2f75a94](https://github.com/anncwb/vue-vben-admin/commit/2f75a948899713e10b200e0f39a48d4b62ef231e))
- add card-list page ([3a132f3](https://github.com/anncwb/vue-vben-admin/commit/3a132f3f4f4e08b4675c157548aa093b3a1c3c94))
- add collapsedShowTitle setting ([5737e47](https://github.com/anncwb/vue-vben-admin/commit/5737e478f671e7f1c60f7db08a0007f154b6f4b8))
- add count-to component and demo ([afc7263](https://github.com/anncwb/vue-vben-admin/commit/afc7263efb90c0410041358a9dd5f10ec685ac2f))
- add design setting ([bae53f3](https://github.com/anncwb/vue-vben-admin/commit/bae53f3e2c62b3fca246432307f45a6363c4c176))
- add error handle ([7101587](https://github.com/anncwb/vue-vben-admin/commit/7101587b9676c91e9079044a096df08848f1f602))
- add file download demo ([db3092d](https://github.com/anncwb/vue-vben-admin/commit/db3092db2eb7d5346778847757adb2b9c4041ed5))
- add lazyContainer comp and demo ([fdeaa00](https://github.com/anncwb/vue-vben-admin/commit/fdeaa00bf24b0710ca341fafba8327c786ab9879))
- add markdown component ([5fb069f](https://github.com/anncwb/vue-vben-admin/commit/5fb069f432799e0d17a7102fae70757e320dc0c5))
- add notice ([#47](https://github.com/anncwb/vue-vben-admin/issues/47)) ([7a1e94c](https://github.com/anncwb/vue-vben-admin/commit/7a1e94c49d546e155d8c17b492ff6b1e5fb55121))
- add permissionCacheType setting ([26b6109](https://github.com/anncwb/vue-vben-admin/commit/26b6109ca08a28c37355474bf8593f2e2b741ef6))
- add pwa ([a1b9902](https://github.com/anncwb/vue-vben-admin/commit/a1b9902b97da03d0ee1e99a021fc6497b8f51fa6))
- add README.en-US.md ([#37](https://github.com/anncwb/vue-vben-admin/issues/37)) ([7437896](https://github.com/anncwb/vue-vben-admin/commit/74378960345e706b45fab1f39fba045a1e95a547))
- add result page demo ([21e0548](https://github.com/anncwb/vue-vben-admin/commit/21e0548e34cf70ebf97967089f458e759ca326d9))
- add search page ([dddda5b](https://github.com/anncwb/vue-vben-admin/commit/dddda5b296025d1d6b37ec15930a02722b8e1b0c))
- add search-list page ([4cb3784](https://github.com/anncwb/vue-vben-admin/commit/4cb3784f13fc516c6343798e8bf8a435e14d774c))
- add tab drag and drop sort ([cedba37](https://github.com/anncwb/vue-vben-admin/commit/cedba37e4cf63456c97f7e391761f176137e0165))
- add table setting ([8b3a4d3](https://github.com/anncwb/vue-vben-admin/commit/8b3a4d37a8addd151b918cf64bce6361376dec9e))
- add tag display to the menu ([a3887f8](https://github.com/anncwb/vue-vben-admin/commit/a3887f8cd99546cde8882d77271cc430eb7a83f5))
- add the parameter sortFn to the table ([491ba9a](https://github.com/anncwb/vue-vben-admin/commit/491ba9a3cc19ceb97dd9a6448831b64c86e1e475))
- add the parameter submitOnReset to the form ([#54](https://github.com/anncwb/vue-vben-admin/issues/54)) ([d09406e](https://github.com/anncwb/vue-vben-admin/commit/d09406e3cb8cfc069ce79b5f4194f7d959f63daf))
- add tinymce embedded form example ([58f988a](https://github.com/anncwb/vue-vben-admin/commit/58f988a7184dd7bdec415627e16b56b80f36b661))
- add useDesign ([74e62cb](https://github.com/anncwb/vue-vben-admin/commit/74e62cbc712bdd4d4826e5fe80f537d87e44ffce))
- added base64 file stream download ([a161bfa](https://github.com/anncwb/vue-vben-admin/commit/a161bfa818cb63d9cc0b00ae062eb16b1efaf74f))
- auto import route ([8a1bfdf](https://github.com/anncwb/vue-vben-admin/commit/8a1bfdf13de966acc5eb41718ccb085d3efc4581))
- axios add joinTime field ([f646e37](https://github.com/anncwb/vue-vben-admin/commit/f646e37754d21ba7c89437176bd9e375924dee03))
- first screen loading waiting animation ([4811cce](https://github.com/anncwb/vue-vben-admin/commit/4811cce809453df78dc2c25cd9805eae483297fc))
- global loading add text ([4f98978](https://github.com/anncwb/vue-vben-admin/commit/4f98978edacbe72610a226267628ab20b57cfc4e))
- integrate upload components into form by default ([be2b8a7](https://github.com/anncwb/vue-vben-admin/commit/be2b8a7e175033dace7a521ab26cd319c5cfdea6))
- multi-language component ([dc09de1](https://github.com/anncwb/vue-vben-admin/commit/dc09de1e052d6b104c5af3a426af6b0e7bb147c7))
- multi-language layout ([e5f8ce3](https://github.com/anncwb/vue-vben-admin/commit/e5f8ce3fd8ec25c6fdb122867cd33e4e84a6f43f))
- multi-language support ([1901129](https://github.com/anncwb/vue-vben-admin/commit/19011296ed61f820356f6b201cbb274d57dcb7d3))
- new menu and top bar color selection color matching ([7692ffb](https://github.com/anncwb/vue-vben-admin/commit/7692ffb95b94672b6fbc8c25fd43d9dd1a1da81e))
- projectSetting add closeMessageOnSwitch and removeAllHttpPending ([e83cb06](https://github.com/anncwb/vue-vben-admin/commit/e83cb06bb93544369c8934d1065bf46835e3f003))
- restore the breadcrumb display icon function ([f65bed7](https://github.com/anncwb/vue-vben-admin/commit/f65bed72ac8c63aaed640d59703f73e83de80da5))
- right-click menu supports multiple levels ([f645680](https://github.com/anncwb/vue-vben-admin/commit/f645680a3b9a1f75395329970551d9e5d6bd845b))
- routes with parameters can be cached ([90b3fab](https://github.com/anncwb/vue-vben-admin/commit/90b3fab28ef53135f3cab1f69a4675f98a130857))
- support mobile layout adaptation ([c774a6d](https://github.com/anncwb/vue-vben-admin/commit/c774a6d3a03d9507a9023d600aa9dd9592f52fb3))
- support vscode i18n-ally plugin ([962f90d](https://github.com/anncwb/vue-vben-admin/commit/962f90de445d7935ad76ea7b74a98f12ce9a7498))
- the cache can be configured to be encrypted ([234c1d1](https://github.com/anncwb/vue-vben-admin/commit/234c1d1fae6a7f2c78e456f992f91622ca599060))
- **analysis:** add analysis page ([52ee35c](https://github.com/anncwb/vue-vben-admin/commit/52ee35c4beca8fc07737aa28328663e86ba797d4))
- **breadcrumb:** support showIcon ([#48](https://github.com/anncwb/vue-vben-admin/issues/48)) ([d8b25b4](https://github.com/anncwb/vue-vben-admin/commit/d8b25b488ba4c6626d3b94ed84270e96f403d859))
- **chart:** add useEcharts and useApexChart demo ([21d0ed9](https://github.com/anncwb/vue-vben-admin/commit/21d0ed92dffd28f45c98afee547d25d9b40dde7f))
- **desc-page:** add desc page demo ([7a00036](https://github.com/anncwb/vue-vben-admin/commit/7a000366b92b942727dd2cd7c0aec193f8c1a7b0))
- **excel:** import/export ([#40](https://github.com/anncwb/vue-vben-admin/issues/40)) ([c0692b0](https://github.com/anncwb/vue-vben-admin/commit/c0692b0f43b50be56e399c4aa07c0c4244080e9f))
- **form:** support function type of form item ([5832ee6](https://github.com/anncwb/vue-vben-admin/commit/5832ee6697e23afefc25ba2aa4df9476b5034bf4))
- **form-page:** add form page demo ([0b6110a](https://github.com/anncwb/vue-vben-admin/commit/0b6110a8fc92a11df6501346e093246a5abe2b0e))
- **from:** add required in schema ([2859067](https://github.com/anncwb/vue-vben-admin/commit/28590676214b1c5fdbf6878e40da45a7bc0c5874))
- **tinymce:** add line height ([#58](https://github.com/anncwb/vue-vben-admin/issues/58)) ([adffefd](https://github.com/anncwb/vue-vben-admin/commit/adffefd702688ba5fa8c5df616b8f3685a0fb778))
- **tinymce:** add rich editor ([c0e4c9e](https://github.com/anncwb/vue-vben-admin/commit/c0e4c9e5a55524840e9598d24d84dcada8b57102))
- **transition:** add transition comp and demo ([3713487](https://github.com/anncwb/vue-vben-admin/commit/3713487c85f4b512ab3e13fcb4c89a14b9ee8d50))
- **trigger:** add trigger config ([4f6b65b](https://github.com/anncwb/vue-vben-admin/commit/4f6b65b8a1b7e694718b4aa42aced1e59e90ec9e))
- the Button component extends the and attributes ([8f5016e](https://github.com/anncwb/vue-vben-admin/commit/8f5016e3f3476539a763162ea235cf2aac230eea))
- the production environment can be dynamically configured ([bb3b8f8](https://github.com/anncwb/vue-vben-admin/commit/bb3b8f817de15d336968354515649f7142cd5683))
- **workbench:** add workbench page ([1cd75fc](https://github.com/anncwb/vue-vben-admin/commit/1cd75fcf5ba7a3114399db8f22cf8eb6f2e4d783))

### Performance Improvements

- **setting-drawer:** perf setting-drawer ([ed41e50](https://github.com/anncwb/vue-vben-admin/commit/ed41e5082fd2e6109c2ad3ff77199d15ac14342a))
- **tabs:** perf multiple-tabs ([f81c401](https://github.com/anncwb/vue-vben-admin/commit/f81c401959dda4b8d568c00786b691c21abbb59c))
- **tabs:** perf multiple-tabs ([27e50b4](https://github.com/anncwb/vue-vben-admin/commit/27e50b47479af8eaeb4be020aeb0fcbdb4308295))
- Add the style injection of the top row to the form. ([#102](https://github.com/anncwb/vue-vben-admin/issues/102)) ([b9d3d60](https://github.com/anncwb/vue-vben-admin/commit/b9d3d60e0f8fe1166a0addcc8295365cbe65a7bf))
- adjust the logic of ([b350098](https://github.com/anncwb/vue-vben-admin/commit/b350098f442be1b8143b44e09e735179676f755c))
- code style ([f96d6b2](https://github.com/anncwb/vue-vben-admin/commit/f96d6b221c7ad97e0ed80250acb192b6be92c4a6))
- enhance openModal and openDrawer ([b6d5e5c](https://github.com/anncwb/vue-vben-admin/commit/b6d5e5c96f89c31d4df11e71f2d4cb5ecf8f0b92))
- layout code adjustment ([4392917](https://github.com/anncwb/vue-vben-admin/commit/439291746fe237410140575be2a634a74e8ef382))
- layout style optimization ([7702832](https://github.com/anncwb/vue-vben-admin/commit/77028321816f00799cc3f70d3f0d6bde27c34522))
- mobile style adjustment ([1899146](https://github.com/anncwb/vue-vben-admin/commit/1899146f71ab2020dc01bd84b282e6b614ad3d57))
- optimize lazy loading components ([87fcd0d](https://github.com/anncwb/vue-vben-admin/commit/87fcd0d21ea78ce916a4f2b9cdcceda5e7866eee))
- optimize multiple-tab switching effect ([f2bdf0b](https://github.com/anncwb/vue-vben-admin/commit/f2bdf0b86dd818f3cc59fdb0c55eb1b53b222f7f))
- optimize preview and ContextMenu functions ([bbfb06f](https://github.com/anncwb/vue-vben-admin/commit/bbfb06f0ad1e345b0e716da730acaf7c0a778e4b))
- optimize settingDrawer code ([4ff6b73](https://github.com/anncwb/vue-vben-admin/commit/4ff6b73c2bb57764db2bcd8212d82f028e25e36d))
- optimize tab switching speed ([4baf90a](https://github.com/anncwb/vue-vben-admin/commit/4baf90a5c87493939830129efaa146624faabbcc))
- optimize the size of the first screen ([968f791](https://github.com/anncwb/vue-vben-admin/commit/968f791f4b7112730813c8c990379051c3f8340d))
- optimized page switching effect ([5f2a927](https://github.com/anncwb/vue-vben-admin/commit/5f2a927cd50a5efe4c9576528d944553c5243277))
- perf component ([73c8e0c](https://github.com/anncwb/vue-vben-admin/commit/73c8e0c1583afa83353ff36d1d9ec847776d3016))
- perf context menu ([6e03e05](https://github.com/anncwb/vue-vben-admin/commit/6e03e05032474c858151b3835eb5318486a56729))
- perf excel comp code ([eecde4c](https://github.com/anncwb/vue-vben-admin/commit/eecde4c7e947cf392dbd8eace2db8ed9aea417b1))
- perf loading logic ([f4621cc](https://github.com/anncwb/vue-vben-admin/commit/f4621cc66411d8ff4ca852b548a79cd3da9be1ce))
- perf menu ([88f4a3f](https://github.com/anncwb/vue-vben-admin/commit/88f4a3f02a0c0f35953c93427fe700d414b6ec50))
- perf menu mini style ([66acb21](https://github.com/anncwb/vue-vben-admin/commit/66acb21edda3fcac61849c7c03c6b396992d8d06))
- perf modal and drawer ([81baf1d](https://github.com/anncwb/vue-vben-admin/commit/81baf1d5c4606aab83c0e65397ce4b090c2e4e08))
- tsx use useExpose ([9bb7514](https://github.com/anncwb/vue-vben-admin/commit/9bb751475dc212d4e2829468cf1a11502137071e))
- **button:** delete the button component useless code ([bdce845](https://github.com/anncwb/vue-vben-admin/commit/bdce84537aa58b9507744a3a14c8d598e88e95fc))
- **drawer:** perf drawer ([28f7f7b](https://github.com/anncwb/vue-vben-admin/commit/28f7f7bf7f3ae49759b44395f6b06c2c61359d04))
- **lazy-container:** optimize lazyContainer code ([0f4b847](https://github.com/anncwb/vue-vben-admin/commit/0f4b847d69e90e5bbb4fb0883fb5ea1dd1daf1e7))
- **logo:** optimize logo code ([e79e540](https://github.com/anncwb/vue-vben-admin/commit/e79e540b48be80fb08b67a99e64bede3816b2c9e))
- **menu:** optimize layout menu ([96c10d6](https://github.com/anncwb/vue-vben-admin/commit/96c10d6c0fb46b56b0e74e09a8e20bcfc9f54cde))
- **modal:** optimize table embedding height calculation problem ([9abf176](https://github.com/anncwb/vue-vben-admin/commit/9abf1763c78ead7de21ece6d328337a6a1da5f05))
- **strength-meter:** modify name word ([#38](https://github.com/anncwb/vue-vben-admin/issues/38)) ([19477cd](https://github.com/anncwb/vue-vben-admin/commit/19477cd980661ace337ec6e3295f76c44d05763c))
- **table:** optimize effect performance ([a1ffb61](https://github.com/anncwb/vue-vben-admin/commit/a1ffb61804940f1ebaea741b0df41485ad95d5f2))
- **upload:** improve upload component ([661db0c](https://github.com/anncwb/vue-vben-admin/commit/661db0c767772bb7a30da9d3eeaf2b47858ccf0b))
- **use-message:** fix typo ([bcab4b7](https://github.com/anncwb/vue-vben-admin/commit/bcab4b774d384a5de9b87a0c700a9937c79eb5cd))
- perf TableAction ([4b384b1](https://github.com/anncwb/vue-vben-admin/commit/4b384b137c58428f0cf28621e183250da4576479))
- performance optimization ([70fba7e](https://github.com/anncwb/vue-vben-admin/commit/70fba7ecac80a1cd8ec08052e8265641f2b56204))
- pwa icon ([404c73d](https://github.com/anncwb/vue-vben-admin/commit/404c73de450c165ffe623ca2969322bae1786a73))
- remove optional chain ([e034d1b](https://github.com/anncwb/vue-vben-admin/commit/e034d1bacc5501a83188d20129951422bc127e3b))
- review tinymce code ([f75425d](https://github.com/anncwb/vue-vben-admin/commit/f75425d13bc9f6003021fd4b5d6451ae096c09b7))
- set cache default time ([c620f82](https://github.com/anncwb/vue-vben-admin/commit/c620f8279f1056ddab84b3907fb50b3af4fe9247))
- tabs optimization ([6e40051](https://github.com/anncwb/vue-vben-admin/commit/6e4005111db58ca10f10e9aa4bca4aec57363736))
- the existing tab switching no longer displays animation and processbar ([e9536b5](https://github.com/anncwb/vue-vben-admin/commit/e9536b5b7ccc5f667496c4ec7ab838738f804a71))
- the routeModule can ignore the layou configuration without writing ([4c658f4](https://github.com/anncwb/vue-vben-admin/commit/4c658f4868c7df6e0b8f18728c5d5ae53b04448a))
- update form types ([a0c3197](https://github.com/anncwb/vue-vben-admin/commit/a0c3197454b59a231cf6d27048b2e9c0bd7bf77f))

### Reverts

- **table:** revert form type annotation ([261936b](https://github.com/anncwb/vue-vben-admin/commit/261936b117d1d261ecb8fafc0f6c839cb2913918))

# [2.0.0-beta.3](https://github.com/anncwb/vue-vben-admin/compare/2.0.0-beta.2...2.0.0-beta.3) (2020-10-07)

### Features

- **setting:** add openNProgress setting ([67d0ff0](https://github.com/anncwb/vue-vben-admin/commit/67d0ff0e251f584883d50fd71b2413b6ca94729d))
- **table:** add table component ([faf3f46](https://github.com/anncwb/vue-vben-admin/commit/faf3f4602ecf4b16ff57994668edc8433a43945d))

# [2.0.0-beta.2](https://github.com/anncwb/vue-vben-admin/compare/2.0.0-beta.1...2.0.0-beta.2) (2020-10-07)

### Features

- **img-preview:** add imgPreview componnt ([e6093aa](https://github.com/anncwb/vue-vben-admin/commit/e6093aa4f48f3b3c16b1640c56512e6e3cf84c4b))

# [2.0.0-beta.1](https://github.com/anncwb/vue-vben-admin/compare/2f268ca8f43d98687ffd809e2c1d140d29033bd6...2.0.0-beta.1) (2020-09-30)

### Bug Fixes

- fix form,transition,build bug ([2f268ca](https://github.com/anncwb/vue-vben-admin/commit/2f268ca8f43d98687ffd809e2c1d140d29033bd6))
