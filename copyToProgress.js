// 求職者一覧の日程調整が「調整済み」になった場合、進捗リストに追加をする

(function () {
  "use strict";
  console.log("Run copyToProgress", new Date().toLocaleString());
  kintone.events.on(
    [
      "app.record.edit.submit",
      "app.record.create.submit",
      "app.record.index.edit.submit.success",
    ],
    function (event) {
      console.log("Run event");
      const record = event.record;
      const recordId = event.recordId; // 求職者一覧のレコードID
      console.log(record[$id].value);
      console.log(recordId);
      // セレクターが "調整済み" のとき
      if (record["schedule"].value === "調整済み") {
        var postRecord = {
          app: 14, // 進捗一覧のアプリID = 14
          record: {
            name: { value: record["name"].value },
            tel: { value: record["tel"].value },
            email: { value: record["email"].value },
            title: { value: record["title"].value },
            media: { value: record["media"].value },
            from_company: { value: record["from_company"].value },
            link: { value: record["link"].value },
            schedule: { value: record["schedule"].value },
            unique_id: { value: recordId },
            // 必要なフィールドを追加
          },
        };

        return kintone
          .api(kintone.api.url("/k/v1/record", true), "POST", postRecord)
          .then(function (resp) {
            return event; // 問題なければそのまま保存
          })
          .catch(function (error) {
            alert("進捗一覧への登録に失敗しました: " + error.message);
            return false; // 保存キャンセル
          });
      }

      return event;
    }
  );
})();
