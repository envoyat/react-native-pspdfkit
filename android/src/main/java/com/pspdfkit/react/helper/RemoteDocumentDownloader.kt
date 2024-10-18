package com.pspdfkit.react.helper

import android.content.Context
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.FragmentActivity
import androidx.fragment.app.FragmentManager
import com.facebook.react.bridge.ReactApplicationContext
import com.pspdfkit.document.download.DownloadJob
import com.pspdfkit.document.download.DownloadProgressFragment
import com.pspdfkit.document.download.DownloadRequest
import com.pspdfkit.document.download.source.DownloadSource
import java.io.File
import java.io.IOException
import java.io.InputStream
import java.net.HttpURLConnection
import java.net.MalformedURLException
import java.net.URL
import java.net.URLConnection

class RemoteDocumentDownloader(private val remoteURL: String,
                               private var destinationFileURL: String?,
                               private val overwriteExisting: Boolean,
                               private val context: Context,
                               private val fragmentManager: FragmentManager) {

    fun startDownload(callback: (File?) -> Unit) {
        val source: WebDownloadSource = try {
            // Try to parse the URL pointing to the PDF document.
            WebDownloadSource(URL(remoteURL))
        } catch (e: MalformedURLException) {
            // Error while trying to parse the PDF Download URL
            return
        }

        if (overwriteExisting && destinationFileURL != null) {
            val delete = destinationFileURL?.let { File(it) }
            if (delete != null) {
                if (delete.exists()) {
                    delete.delete()
                }
            }
        }

        val request = DownloadRequest.Builder(context)
                .source(source)
                .outputFile(if (destinationFileURL == null)
                    File(context.getDir("documents", Context.MODE_PRIVATE), "temp.pdf") else
                    destinationFileURL?.let { File(it) })
                .overwriteExisting(overwriteExisting)
                .useTemporaryOutputFile(false)
                .build()

        val job = DownloadJob.startDownload(request)
        job.setProgressListener(object : DownloadJob.ProgressListenerAdapter() {
            override fun onComplete(output: File) {
                callback(output)
            }

            override fun onError(exception: Throwable) {
                callback(null)
            }
        })
        val fragment = DownloadProgressFragment()
        fragment.show(fragmentManager, "download-fragment")
        fragment.job = job
    }
}

class WebDownloadSource constructor(private val documentURL: URL) : DownloadSource {
    /**
     * The open method needs to return an [InputStream] that will provide the complete document.
     */
    @Throws(IOException::class)
    override fun open(): InputStream {
        val connection = documentURL.openConnection() as HttpURLConnection
        connection.connect()
        return connection.inputStream
    }

    /**
     * If the length is available it can be returned here. This is optional, and can improve the reported download progress, since it will then contain
     * a percentage of download.
     */
    override fun getLength(): Long {
        var length = DownloadSource.UNKNOWN_DOWNLOAD_SIZE

        // We try to estimate the download size using the content length header.
        var urlConnection: URLConnection? = null
        try {
            urlConnection = documentURL.openConnection()
            val contentLength = urlConnection.contentLength
            if (contentLength != -1) {
                length = contentLength.toLong()
            }
        } catch (e: IOException) {
            // Error while trying to parse the PDF Download URL
        } finally {
            (urlConnection as? HttpURLConnection)?.disconnect()
        }
        return length
    }

    override fun toString(): String {
        return "WebDownloadSource{documentURL=$documentURL}"
    }
}