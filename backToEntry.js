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
      var record = event.record;
      var scheduleValue = record["schedule"].value;
      var relatedId = record["related_record_id"].value; // 求職者一覧のレコードID

      console.log("schedule:", scheduleValue);
      console.log("related_record_id:", relatedId);
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
