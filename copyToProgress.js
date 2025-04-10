(function () {
  "use strict";
  console.log("hello! ratrun!");
  kintone.events.on(
    [
      "app.record.edit.submit",
      "app.record.create.submit",
      "app.record.index.edit.submit.success",
    ],
    function (event) {
      console.log("event 着火");
      var record = event.record;
      // ラジオボタンが "true" のとき
      console.log(record["schedule"].value);
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
