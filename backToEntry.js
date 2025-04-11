// 進捗一覧の「日程調整」が「不参加」になった場合、求職者リストの「日程調整」を未調整に変更する
(function () {
  "use strict";
  console.log("Run backToEntry");

  kintone.events.on(
    [
      "app.record.edit.submit",
      "app.record.create.submit",
      "app.record.index.edit.submit.success",
    ],
    function (event) {
      console.log("Run event");
      const record = event.record;
      const recordId = event.record.recordId; // 求職者一覧のレコードID
      const scheduleValue = record["schedule"].value;

      console.log("schedule:", scheduleValue);
      console.log(recordId);
      // セレクトを不参加にした時
      if (scheduleValue === "不参加" && relatedId) {
        var updateRecord = {
          app: 11, // 求職者一覧アプリのID
          id: relatedId, // 更新対象のレコードID
          record: {
            schedule: {
              value: "未実施",
            },
          },
        };
        console.log("修正したschedule:", scheduleValue);

        return kintone
          .api(kintone.api.url("/k/v1/record", true), "PUT", updateRecord)
          .then(function (resp) {
            console.log("更新成功");
            return event;
          })
          .catch(function (error) {
            alert("求職者一覧の更新に失敗しました: " + error.message);
            return false;
          });
      }

      return event;
    }
  );
})();
