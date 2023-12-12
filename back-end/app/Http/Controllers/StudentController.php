<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Student;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{

    public function index()
    {
        
        return response()->json(['user' => Auth::guard('student')->user(), 'guard' => 'student', 'admin' => Admin::find(Auth::guard('student')->user()->admin_id)], 200);
    }

    public function get_all_students()
    {
        // return data from last added with pagination
        return Admin::find(Auth::guard('admin')->user()->id)->students()->latest()->paginate(10); // Student::latest()->paginate(10);
    }

    public function show($id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 422);
        }
        return $student;
    }

    public function change_pass(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'oldPassword' => 'required',
            'newPassword' => 'required|min:6',
            'confirmNewPassword' => 'required|same:newPassword',
        ]);

        $student = Student::find($request->id);

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 422);
        }

        // Check if the old password matches the current password
        if (!Hash::check($request->oldPassword, $student->password)) {
            return response()->json(['message' => 'Old password is incorrect'], 422);
        }

        // Update the password
        $student->password = Hash::make($request->newPassword);
        $student->genereted_password = null;
        $student->save();

        return response()->json(['message' => 'Password changed successfully', 'student' => Auth::guard('student')->user()], 200);
    }


    public function resetPassword($id)
    {

        $newRandomPass = Str::random(8);

        if (!Student::find($id)) {
            return response()->json(['message' => 'Student not found'], 422);
        }

        $student = Student::find($id);
        $student->password = Hash::make($newRandomPass);
        $student->genereted_password = $newRandomPass;

        if (!$student->save()) {
            return response()->json(['message' => 'Password reset failed try again later'], 422);
        }

        return response()->json(['message' => 'Password reset successfully', 'newPassword' => $newRandomPass, 'student' => Student::latest()->get()], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name_add' => 'required|min:3',
            'userName_add' => 'required|min:3|unique:students,user_name',
            'sexe_add' => 'required',
        ]);

        $pass_generate = Str::random(8);

        $newStudent = new Student();
        $newStudent->name = $request->name_add;
        $newStudent->user_name = $request->userName_add;
        $newStudent->sexe = $request->sexe_add;
        $newStudent->password = Hash::make($pass_generate);
        $newStudent->genereted_password = $pass_generate;
        $newStudent->admin_id = Auth::guard('admin')->user()->id;


        if (!$newStudent->save()) {
            return response()->json(['message' => 'Student creation failed try again'], 422);
        }

        return response()->json(['message' => 'Student created successfully', 'password' => $pass_generate, 'student' => Student::latest()->get()], 200);
    }


    public function generate_userName()
    {
        $generate_userName = Str::random(8);
        while (Student::where('user_name', $generate_userName)->exists()) {
            $generate_userName = Str::random(8);
        }
        return response()->json(['user_name' => $generate_userName], 200);
    }




    public function update(Request $request, $id)
    {
        $request->validate([
            'name_update' => 'required|min:3',
            'sexe_update' => ['required'],
        ]);

        if (!Student::find($id)) {
            return response()->json(['message' => 'Student not found'], 422);
        }

        $student = Student::find($id);
        $student->name = $request->name_update;
        $student->sexe = $request->sexe_update;

        if (!$student->save()) {
            return response()->json(['message' => 'Student update failed try again later'], 422);
        }

        return response()->json(['message' => 'Student updated successfully', 'student' => $student], 200);
    }


    public function add_email(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'email' => 'required|email',
        ]);


        if (!Student::find($request->id)->update(['email' => $request->email])) {
            return response()->json(['message' => 'Student email add failed try again'], 422);
        }

        return response()->json(['message' => 'Student email added successfully', 'student' => Student::find($request->id)], 200);
    }


    public function destroy($id)
    {
        if (!Student::find($id)->delete()) {
            return response()->json(['message' => 'Student delete failed try again later'], 422);
        }

        return response()->json(['message' => 'Student deleted successfully', 'student' => Student::latest()->get()], 200);
    }
}
