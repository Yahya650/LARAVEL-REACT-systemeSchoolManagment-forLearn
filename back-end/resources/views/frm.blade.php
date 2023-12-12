<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    {{-- <a href="/admin/email/verification-notification">verify email</a> --}}
    <form action="/admin/email/verification-notification" method="post">
        @csrf
        <input type="email" name="email" id="">
        <button type="submit">verify emailend</button>
    </form>
</body>
</html>