package com.saudiceramics.webview

import android.Manifest
import android.app.Activity
import android.content.pm.PackageManager
import android.os.Bundle
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.WebResourceRequest
import android.view.ViewGroup
import android.widget.FrameLayout

class MainActivity : Activity() {
    private lateinit var webView: WebView
    private var pendingWebPermission: PermissionRequest? = null
    private val audioPermissionCode = 701
    private val appUrl = "https://saudi-ceramics-ai-1.ai.studio"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        webView = WebView(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.mediaPlaybackRequiresUserGesture = false
            settings.javaScriptCanOpenWindowsAutomatically = true
            webViewClient = object : WebViewClient() {
                override fun onPageFinished(view: WebView, url: String) {
                    super.onPageFinished(view, url)
                    if (url.startsWith(appUrl)) injectExistingAgent(view)
                }
                override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                    return false
                }
            }
            webChromeClient = object : WebChromeClient() {
                override fun onPermissionRequest(request: PermissionRequest) {
                    val wantsMic = request.resources.contains(PermissionRequest.RESOURCE_AUDIO_CAPTURE)
                    if (!wantsMic) {
                        request.deny()
                        return
                    }
                    if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) {
                        request.grant(arrayOf(PermissionRequest.RESOURCE_AUDIO_CAPTURE))
                    } else {
                        pendingWebPermission = request
                        requestPermissions(arrayOf(Manifest.permission.RECORD_AUDIO), audioPermissionCode)
                    }
                }
            }
            loadUrl(appUrl)
        }
        setContentView(webView)
    }

    private fun injectExistingAgent(view: WebView) {
        val js = """
            (function() {
              if (window.__scDidAgentLoaded) return;
              window.__scDidAgentLoaded = true;
              const s = document.createElement('script');
              s.type = 'module';
              s.src = 'https://agent.d-id.com/v2/index.js';
              s.setAttribute('data-mode', 'fabio');
              s.setAttribute('data-client-key', 'ck_OO4TWPiyzqbHV6mijfzTs');
              s.setAttribute('data-agent-id', 'v2_agt_PIurXsZC');
              s.setAttribute('data-name', 'did-agent');
              s.setAttribute('data-monitor', 'true');
              s.setAttribute('data-light-mode', 'false');
              s.setAttribute('data-orientation', 'horizontal');
              s.setAttribute('data-position', 'right');
              s.setAttribute('data-open-mode', 'compact');
              document.body.appendChild(s);
            })();
        """.trimIndent()
        view.evaluateJavascript(js, null)
    }

    override fun onRequestPermissionsResult(
        requestCode: Int, permissions: Array<out String>, grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == audioPermissionCode) {
            val request = pendingWebPermission
            pendingWebPermission = null
            if (request != null) {
                if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    request.grant(arrayOf(PermissionRequest.RESOURCE_AUDIO_CAPTURE))
                } else {
                    request.deny()
                }
            }
        }
    }

    @Deprecated("Deprecated in Android")
    override fun onBackPressed() {
        if (::webView.isInitialized && webView.canGoBack()) webView.goBack()
        else super.onBackPressed()
    }

    override fun onDestroy() {
        if (::webView.isInitialized) {
            pendingWebPermission?.deny()
            webView.stopLoading()
            webView.destroy()
        }
        super.onDestroy()
    }
}
