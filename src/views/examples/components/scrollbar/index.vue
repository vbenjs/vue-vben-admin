<script lang="tsx">
  import { defineComponent, ref, unref } from 'compatible-vue';

  import { Row, Col, Alert, Button } from 'ant-design-vue';
  import { ScrollContainer } from '@/components/container/index';

  function getData() {
    const res: number[] = [];
    for (let i = 1; i <= 100; i++) {
      res.push(i);
    }
    return res;
  }
  export default defineComponent({
    name: 'ScrollbarExample',
    setup() {
      const scrollRef = ref<any>(null);

      function handleScroll(to: number) {
        const scroll = unref(scrollRef);
        if (scroll) {
          scroll.scrollTo(to);
        }
      }

      function handleScrollBottom() {
        const scroll = unref(scrollRef);
        if (scroll) {
          scroll.scrollBottom();
        }
      }
      return () => (
        <div class="p-4 scrollbar-demo">
          <Row>
            <Col span={11}>
              <Alert
                message="抽取el-scrollbar，并对其进行扩展,滚动条美化,适用于各个浏览器"
                type="info"
              />
              <div class="box1">
                <ScrollContainer>
                  <ul>
                    {getData().map((item) => {
                      return <li key={item}>{item}</li>;
                    })}
                  </ul>
                </ScrollContainer>
              </div>
            </Col>
            <Col span={11} offset={1}>
              <Alert
                message="抽取el-scrollbar，并对其进行扩展,滚动条美化,适用于各个浏览器"
                type="info"
              />
              <div class="my-3">
                <Button onClick={handleScroll.bind(null, 100)}>滚动到100px位置</Button>
                <Button class="mx-3" onClick={handleScroll.bind(null, 800)}>
                  滚动到800px位置
                </Button>
                <Button class="mr-3" onClick={handleScroll.bind(null, 0)}>
                  滚动到顶部
                </Button>
                <Button onClick={handleScrollBottom}>滚动到底部部</Button>
              </div>

              <div class="box1">
                <ScrollContainer ref={scrollRef}>
                  <ul>
                    {getData().map((item) => {
                      return <li key={item}>{item}</li>;
                    })}
                  </ul>
                </ScrollContainer>
              </div>
            </Col>
          </Row>
        </div>
      );
    },
  });
</script>

<style lang="less" scoped>
  .scrollbar-demo {
    .box1 {
      width: 100%;
      height: 300px;
      margin: 20px 0;
      background: #fff;

      ul {
        padding: 10px;
      }

      li {
        line-height: 30px;
        border-bottom: 1px solid #ddd;
      }
    }
  }
</style>
