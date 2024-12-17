package com.yourapp

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.hardware.display.DisplayManager
import android.hardware.display.VirtualDisplay
import android.media.MediaRecorder
import android.media.projection.MediaProjection
import android.media.projection.MediaProjectionManager
import com.facebook.react.bridge.*
import java.io.File
import java.text.SimpleDateFormat
import java.util.*

class ScreenRecorderModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var mediaProjection: MediaProjection? = null
    private var virtualDisplay: VirtualDisplay? = null
    private var mediaRecorder: MediaRecorder? = null
    private var isRecording = false

    override fun getName() = "ScreenRecorderModule"

    @ReactMethod
    fun startRecording(promise: Promise) {
        val activity = currentActivity ?: return promise.reject("ERROR", "Activity not found")
        
        try {
            val mediaProjectionManager = activity.getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
            val intent = mediaProjectionManager.createScreenCaptureIntent()
            
            activity.startActivityForResult(intent, SCREEN_RECORD_REQUEST_CODE)
            // Handle the result in your MainActivity
            
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun stopRecording(promise: Promise) {
        try {
            if (isRecording) {
                mediaRecorder?.stop()
                mediaRecorder?.reset()
                virtualDisplay?.release()
                mediaProjection?.stop()
                
                isRecording = false
                promise.resolve(getOutputFile().absolutePath)
            } else {
                promise.resolve(null)
            }
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    private fun getOutputFile(): File {
        val filename = SimpleDateFormat("yyyy-MM-dd-HH-mm-ss", Locale.US)
            .format(Date()) + ".mp4"
        val path = reactApplicationContext.getExternalFilesDir(null)?.absolutePath
        return File(path, filename)
    }

    @ReactMethod
    fun getRecordings(promise: Promise) {
        try {
            val recordings = mutableListOf<WritableMap>()
            val recordingsDir = reactApplicationContext.getExternalFilesDir(null)
            
            recordingsDir?.listFiles()?.filter { it.extension == "mp4" }?.forEach { file ->
                val recording = Arguments.createMap().apply {
                    putString("path", file.absolutePath)
                    putString("name", file.name)
                    putDouble("lastModified", file.lastModified().toDouble())
                    putDouble("size", file.length().toDouble())
                }
                recordings.add(recording)
            }
            
            promise.resolve(Arguments.makeNativeArray(recordings))
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun deleteRecording(path: String, promise: Promise) {
        try {
            val file = File(path)
            if (file.exists()) {
                file.delete()
                promise.resolve(true)
            } else {
                promise.resolve(false)
            }
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun playRecording(path: String, promise: Promise) {
        try {
            val activity = currentActivity ?: return promise.reject("ERROR", "Activity not found")
            
            val intent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(Uri.parse(path), "video/mp4")
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            
            activity.startActivity(intent)
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    companion object {
        const val SCREEN_RECORD_REQUEST_CODE = 1000
    }
} 