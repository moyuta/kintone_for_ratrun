// 進捗一覧の「日程調整」が「不参加」になった場合、求職者リストの「日程調整」を未調整に変更する
(function () {
  "use strict";
  console.log("Run backToEntry", new Date().toLocaleString());

  kintone.events.on(
    [
      "app.record.edit.submit",
      "app.record.create.submit",
      "app.record.index.edit.submit.success",
    ],
    function (event) {
      console.log("Run event");
      const record = event.record;
      const scheduleValue = record["schedule"].value;
      const uniqueIdValue = record["unique_id"].value;
      console.log("schedule:", scheduleValue);
      console.log(uniqueIdValue);
      // セレクトを不参加にした時
      if (scheduleValue === "不参加" && recordId) {
        var updateRecord = {
          app: 11, // 求職者一覧アプリのID
          id: uniqueIdValue, // 更新対象のレコードID
          record: {
            schedule: {
              value: "未実施",
            },
          },
        };
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
